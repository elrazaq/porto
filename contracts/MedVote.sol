// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedVote - Hospital Medical Committee Chairman E-Voting Smart Contract
 * @author Abdul Razak, S.T.
 * @notice Tamper-proof, transparent, and auditable e-voting system for RSUD Medical Committee Election.
 * @dev Optimized for gas efficiency using custom errors, unchecked loops, and compact structs.
 */
contract MedVote {
    // ==========================================
    // CUSTOM ERRORS (Gas Efficient)
    // ==========================================
    error UnauthorizedAdmin();
    error ElectionNotActive();
    error ElectionAlreadyEnded();
    error VoterNotWhitelisted();
    error VoterAlreadyVoted();
    error InvalidCandidateId();
    error EmptyCandidateName();
    error EmptyBatchList();

    // ==========================================
    // STRUCTS & STATE VARIABLES
    // ==========================================
    struct Candidate {
        uint256 id;
        string name;          // e.g., "dr. Hendra Wijaya, Sp.PD-KGEH, FINASIM"
        string specialist;    // e.g., "Spesialis Penyakit Dalam - Konsultan"
        string visionMission; // Short vision & mission statement
        string avatarUrl;     // Photo URL / IPFS URI
        uint256 voteCount;
    }

    struct VoterInfo {
        bool isWhitelisted;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 votedTimestamp;
    }

    address public immutable electionAdmin;
    string public electionTitle;
    string public hospitalName;
    bool public isElectionActive;
    uint256 public totalVotesCast;

    Candidate[] private candidates;
    mapping(address => VoterInfo) public voters;

    // ==========================================
    // EVENTS (For Real-Time Audit Log)
    // ==========================================
    event CandidateAdded(
        uint256 indexed candidateId,
        string name,
        string specialist
    );
    event VotersWhitelisted(uint256 count, address indexed addedBy);
    event VoteCast(
        address indexed voter,
        uint256 indexed candidateId,
        uint256 timestamp
    );
    event ElectionStatusChanged(bool isActive, uint256 timestamp);

    // ==========================================
    // MODIFIERS
    // ==========================================
    modifier onlyAdmin() {
        if (msg.sender != electionAdmin) revert UnauthorizedAdmin();
        _;
    }

    modifier whenElectionActive() {
        if (!isElectionActive) revert ElectionNotActive();
        _;
    }

    // ==========================================
    // CONSTRUCTOR
    // ==========================================
    constructor(string memory _electionTitle, string memory _hospitalName) {
        electionAdmin = msg.sender;
        electionTitle = _electionTitle;
        hospitalName = _hospitalName;
        isElectionActive = true;

        // Auto-whitelist the deployer (Admin) for easy testing
        voters[msg.sender].isWhitelisted = true;

        // Seed 3 initial Medical Committee Chairman Candidates so the DApp works out-of-the-box
        _addCandidateInternal(
            "dr. Hendra Wijaya, Sp.PD-KGEH, FINASIM",
            "Departemen Penyakit Dalam",
            "Transformasi tata kelola klinis berbasis bukti (Evidence-Based Medicine) dan perlindungan hukum tenaga medis.",
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
        );
        _addCandidateInternal(
            "dr. Siti Nurbaya, Sp.A(K), M.Kes",
            "Departemen Kesehatan Anak",
            "Digitalisasi audit medis transparan, peningkatan mutu keselamatan pasien, dan kesejahteraan staf medis.",
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80"
        );
        _addCandidateInternal(
            "dr. Bambang Prakoso, Sp.B-KBD, FICS",
            "Departemen Bedah Digestif",
            "Penguatan kredensialing dokter spesialis, kolaborasi lintas komite, dan modernisasi fasilitas tindakan medis.",
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
        );
    }

    // ==========================================
    // ADMIN FUNCTIONS (Panitia Pemilihan)
    // ==========================================

    /**
     * @notice Add a new candidate to the election
     */
    function addCandidate(
        string calldata _name,
        string calldata _specialist,
        string calldata _visionMission,
        string calldata _avatarUrl
    ) external onlyAdmin {
        if (bytes(_name).length == 0) revert EmptyCandidateName();
        _addCandidateInternal(_name, _specialist, _visionMission, _avatarUrl);
    }

    function _addCandidateInternal(
        string memory _name,
        string memory _specialist,
        string memory _visionMission,
        string memory _avatarUrl
    ) internal {
        uint256 newId = candidates.length;
        candidates.push(
            Candidate({
                id: newId,
                name: _name,
                specialist: _specialist,
                visionMission: _visionMission,
                avatarUrl: _avatarUrl,
                voteCount: 0
            })
        );
        emit CandidateAdded(newId, _name, _specialist);
    }

    /**
     * @notice Batch whitelist verified doctor wallets (1 Doctor = 1 Wallet = 1 Vote)
     * @param _doctorWallets Array of Ethereum/Polygon wallet addresses
     */
    function whitelistVotersBatch(address[] calldata _doctorWallets) external onlyAdmin {
        uint256 length = _doctorWallets.length;
        if (length == 0) revert EmptyBatchList();

        for (uint256 i = 0; i < length; ) {
            address voterAddr = _doctorWallets[i];
            if (voterAddr != address(0) && !voters[voterAddr].isWhitelisted) {
                voters[voterAddr].isWhitelisted = true;
            }
            unchecked {
                ++i;
            }
        }

        emit VotersWhitelisted(length, msg.sender);
    }

    /**
     * @notice Single voter whitelist helper for quick admin demo
     */
    function whitelistSingleVoter(address _doctorWallet) external onlyAdmin {
        voters[_doctorWallet].isWhitelisted = true;
        emit VotersWhitelisted(1, msg.sender);
    }

    /**
     * @notice Toggle election active status (Pause / Resume / Close Election)
     */
    function setElectionStatus(bool _isActive) external onlyAdmin {
        isElectionActive = _isActive;
        emit ElectionStatusChanged(_isActive, block.timestamp);
    }

    // ==========================================
    // CORE VOTING FUNCTION (Dokter Pemilih)
    // ==========================================

    /**
     * @notice Cast an immutable vote for a candidate
     * @param _candidateId The index ID of the chosen candidate
     */
    function vote(uint256 _candidateId) external whenElectionActive {
        VoterInfo storage sender = voters[msg.sender];

        if (!sender.isWhitelisted) revert VoterNotWhitelisted();
        if (sender.hasVoted) revert VoterAlreadyVoted();
        if (_candidateId >= candidates.length) revert InvalidCandidateId();

        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;
        sender.votedTimestamp = block.timestamp;

        unchecked {
            candidates[_candidateId].voteCount += 1;
            totalVotesCast += 1;
        }

        emit VoteCast(msg.sender, _candidateId, block.timestamp);
    }

    // ==========================================
    // READ / VIEW FUNCTIONS (Public Audit)
    // ==========================================

    /**
     * @notice Retrieve all candidates and their real-time vote counts
     */
    function getResults() external view returns (Candidate[] memory) {
        return candidates;
    }

    /**
     * @notice Total number of registered candidates
     */
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    /**
     * @notice Check voter eligibility and status for a specific wallet address
     */
    function getVoterStatus(
        address _voter
    )
        external
        view
        returns (
            bool isWhitelisted,
            bool hasVoted,
            uint256 votedCandidateId,
            uint256 votedTimestamp
        )
    {
        VoterInfo memory info = voters[_voter];
        return (
            info.isWhitelisted,
            info.hasVoted,
            info.votedCandidateId,
            info.votedTimestamp
        );
    }
}
