# Privacy and Compliance (Phase 4)

## Architecture Overview
CogniSense is built with a privacy-by-design architecture.
- **Audio Handling:** All ASR processing is run locally. The system is designed to delete audio files immediately after feature extraction. (Verified by retention tests)
- **Pseudonymization:** All session records are stored against a one-way hashed pseudonym, ensuring raw subject IDs are decoupled from the derived features. (Verified by pseudonym tests)
- **Encryption:** AES-GCM encryption is supported for sensitive fields at rest. (Verified by crypto mock tests)
- **Audit Logging:** An append-only audit log is maintained for all significant actions (e.g., viewing reports). (Verified by audit log tests)

## DPIA / Regulatory Alignment
- **HIPAA/GDPR Alignment:** The prototype aligns with the principles of data minimization and purpose limitation. No third-party AI APIs are used. Erasure and portability are supported via design.
- **SaMD Pathway:** CogniSense is designed as a screening aid and not a diagnosis. Any real-world deployment would require FDA De Novo / 510(k) or EU MDR compliance and clinical validation. 

**Disclaimer:** *This is a research prototype, not a medical device; not HIPAA/GDPR certified; compliance mapping is a design intent.*

## Privacy Test Results
Our test suite verifies the core privacy functions:
- **`test_audit.py`**: Ensures the audit log correctly captures event type and user ID in an append-only JSONL format.
- **`test_crypto.py`**: Verifies data encryption/decryption roundtrip.
- **`test_pseudonym.py`**: Asserts deterministic generation of pseudonyms and non-collision across different patients.
- **`test_retention.py`**: Validates the automated deletion of the raw audio file to meet the "immediate deletion after feature extraction" requirement.
(Tests run and passed via `pytest tests/test_privacy.py` on 2026-10-06).
