// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedVote - Sistem E-Voting Pemilihan Ketua Komite Medik RSUD
 * @author Abdul Razak, S.T.
 * @notice Smart Contract e-voting transparan dan anti-manipulasi untuk Komite Medik Rumah Sakit.
 * @dev Memisahkan secara tegas wewenang Panitia Pemilihan (electionAdmin) dan Hak Suara Dokter (Whitelisted Voters).
 */
contract MedVote {
    // ==========================================
    // CUSTOM ERRORS
    // ==========================================
    error UnauthorizedAdmin();
    error AdminCannotVote();
    error ElectionNotActive();
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
        string number;
        string name;
        string specialist;
        string department;
        string nip;
        string experience;
        string visionMission;
        string avatarUrl;
        uint256 voteCount;
    }

    struct VoterInfo {
        bool isWhitelisted;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 votedTimestamp;
        string doctorName;
        string department;
    }

    address public immutable electionAdmin;
    string public electionTitle;
    string public hospitalName;
    bool public isElectionActive;
    uint256 public totalVotesCast;
    uint256 public totalWhitelisted;

    Candidate[] private candidates;
    mapping(address => VoterInfo) public voters;

    // ==========================================
    // EVENTS (On-Chain Public Audit Log)
    // ==========================================
    event CandidateAdded(
        uint256 indexed candidateId,
        string number,
        string name,
        string department
    );
    event VoterWhitelisted(
        address indexed voter,
        string doctorName,
        string department,
        address indexed addedBy
    );
    event VotersWhitelistedBatch(uint256 count, address indexed addedBy);
    event VoteCast(
        address indexed voter,
        string voterName,
        uint256 indexed candidateId,
        string candidateName,
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

        // Registrasi 3 Kandidat Ketua Komite Medik
        _addCandidateInternal(
            "01",
            "dr. Hendra Wijaya, Sp.PD-KGEH, FINASIM",
            "Spesialis Penyakit Dalam - Konsultan Gastroentero-Hepatologi",
            "KSM Penyakit Dalam",
            "19780412 200501 1 004",
            "18 Tahun Pengabdian Klinis",
            "Transformasi tata kelola klinis berbasis bukti (Evidence-Based Medicine), kemandirian kredensialing staf medis, serta perlindungan hukum dokter yang responsif dan berkeadilan.",
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
        );
        _addCandidateInternal(
            "02",
            "dr. Siti Nurbaya, Sp.A(K), M.Kes",
            "Spesialis Kesehatan Anak - Konsultan Tumbuh Kembang",
            "KSM Kesehatan Anak",
            "19810923 200801 2 009",
            "15 Tahun Pengabdian Klinis",
            "Mewujudkan Komite Medik yang inklusif, berorientasi pada keselamatan pasien (Patient Safety), dan harmonisasi beban kerja serta kesejahteraan dokter spesialis maupun dokter umum.",
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80"
        );
        _addCandidateInternal(
            "03",
            "dr. Bambang Prakoso, Sp.B-KBD, FICS",
            "Spesialis Bedah - Konsultan Bedah Digestif",
            "KSM Bedah Sentral",
            "19761105 200312 1 002",
            "20 Tahun Pengabdian Klinis",
            "Modernisasi standar prosedur operasional tindakan medis, penguatan etika disiplin profesi yang objektif, dan akselerasi pengadaan alat kesehatan berteknologi tinggi.",
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
        );
    }

    // ==========================================
    // ADMIN FUNCTIONS (Khusus Panitia Pemilihan)
    // ==========================================
    function addCandidate(
        string calldata _name,
        string calldata _specialist,
        string calldata _department,
        string calldata _nip,
        string calldata _experience,
        string calldata _visionMission,
        string calldata _avatarUrl
    ) external onlyAdmin {
        if (bytes(_name).length == 0) revert EmptyCandidateName();
        uint256 nextNum = candidates.length + 1;
        string memory numStr = nextNum < 10
            ? string(abi.encodePacked("0", _uint2str(nextNum)))
            : _uint2str(nextNum);
        _addCandidateInternal(
            numStr,
            _name,
            _specialist,
            _department,
            _nip,
            _experience,
            _visionMission,
            _avatarUrl
        );
    }

    function _addCandidateInternal(
        string memory _number,
        string memory _name,
        string memory _specialist,
        string memory _department,
        string memory _nip,
        string memory _experience,
        string memory _visionMission,
        string memory _avatarUrl
    ) internal {
        uint256 newId = candidates.length;
        candidates.push(
            Candidate({
                id: newId,
                number: _number,
                name: _name,
                specialist: _specialist,
                department: _department,
                nip: _nip,
                experience: _experience,
                visionMission: _visionMission,
                avatarUrl: _avatarUrl,
                voteCount: 0
            })
        );
        emit CandidateAdded(newId, _number, _name, _department);
    }

    function registerVoter(
        address _doctorWallet,
        string calldata _doctorName,
        string calldata _department
    ) external onlyAdmin {
        if (_doctorWallet == address(0) || _doctorWallet == electionAdmin) {
            revert AdminCannotVote();
        }
        if (!voters[_doctorWallet].isWhitelisted) {
            voters[_doctorWallet].isWhitelisted = true;
            unchecked {
                totalWhitelisted += 1;
            }
        }
        voters[_doctorWallet].doctorName = _doctorName;
        voters[_doctorWallet].department = _department;
        emit VoterWhitelisted(_doctorWallet, _doctorName, _department, msg.sender);
    }

    function whitelistVotersBatch(address[] calldata _doctorWallets) external onlyAdmin {
        uint256 length = _doctorWallets.length;
        if (length == 0) revert EmptyBatchList();

        uint256 added = 0;
        for (uint256 i = 0; i < length; ) {
            address voterAddr = _doctorWallets[i];
            if (
                voterAddr != address(0) &&
                voterAddr != electionAdmin &&
                !voters[voterAddr].isWhitelisted
            ) {
                voters[voterAddr].isWhitelisted = true;
                if (bytes(voters[voterAddr].doctorName).length == 0) {
                    voters[voterAddr].doctorName = "Staf Medis Fungsional Terverifikasi";
                    voters[voterAddr].department = "Komite Medik RSUD";
                }
                unchecked {
                    ++added;
                }
            }
            unchecked {
                ++i;
            }
        }
        totalWhitelisted += added;
        emit VotersWhitelistedBatch(added, msg.sender);
    }

    function setElectionStatus(bool _isActive) external onlyAdmin {
        isElectionActive = _isActive;
        emit ElectionStatusChanged(_isActive, block.timestamp);
    }

    // ==========================================
    // CORE VOTING FUNCTION (Khusus Dokter DPT)
    // ==========================================
    function vote(uint256 _candidateId) external whenElectionActive {
        if (msg.sender == electionAdmin) revert AdminCannotVote();

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

        string memory vName = bytes(sender.doctorName).length > 0
            ? sender.doctorName
            : "Dokter Anggota DPT";

        emit VoteCast(
            msg.sender,
            vName,
            _candidateId,
            candidates[_candidateId].name,
            block.timestamp
        );
    }

    // ==========================================
    // READ / VIEW FUNCTIONS (Public Audit)
    // ==========================================
    function getResults() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoterStatus(
        address _voter
    )
        external
        view
        returns (
            bool isWhitelisted,
            bool hasVoted,
            uint256 votedCandidateId,
            uint256 votedTimestamp,
            string memory doctorName,
            string memory department
        )
    {
        VoterInfo memory info = voters[_voter];
        return (
            info.isWhitelisted,
            info.hasVoted,
            info.votedCandidateId,
            info.votedTimestamp,
            info.doctorName,
            info.department
        );
    }

    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
