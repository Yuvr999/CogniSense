import json
import time

class AuditLogger:
    def __init__(self, log_file: str = "audit_log.jsonl"):
        self.log_file = log_file
        
    def log_event(self, event_type: str, user_id: str, details: dict):
        event = {
            "timestamp": time.time(),
            "event_type": event_type,
            "user_id": user_id,
            "details": details
        }
        with open(self.log_file, "a") as f:
            f.write(json.dumps(event) + "\n")
            
    def read_log(self):
        # In a real system, this would be restricted and verify integrity.
        events = []
        try:
            with open(self.log_file, "r") as f:
                for line in f:
                    events.append(json.loads(line))
        except FileNotFoundError:
            pass
        return events
