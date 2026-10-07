from typing import Dict, Any

def generate_html_report(patient_id: str, risk_result: Dict[str, Any], narrative: str) -> str:
    """
    Generate a simple HTML report for the clinician.
    """
    tier = risk_result.get("tier", "unknown").upper()
    prob = risk_result.get("probability", 0.0)
    
    html = f"""
    <html>
    <head>
        <title>CogniSense Clinician Report - {patient_id}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .tier-HIGH {{ color: #d9534f; font-weight: bold; }}
            .tier-ELEVATED {{ color: #f0ad4e; font-weight: bold; }}
            .tier-LOW {{ color: #5cb85c; font-weight: bold; }}
            .tier-INDETERMINATE {{ color: #5bc0de; font-weight: bold; }}
            .card {{ border: 1px solid #ddd; padding: 20px; border-radius: 5px; }}
            .disclaimer {{ font-size: 0.8em; color: #777; margin-top: 40px; }}
        </style>
    </head>
    <body>
        <h2>CogniSense Risk Assessment</h2>
        <div class="card">
            <p><strong>Patient Pseudonym:</strong> {patient_id}</p>
            <p><strong>Risk Tier:</strong> <span class="tier-{tier}">{tier}</span></p>
            <p><strong>Fused Probability:</strong> {prob:.2f}</p>
            <h3>Explanation</h3>
            <p>{narrative}</p>
        </div>
        <p class="disclaimer">Disclaimer: This is a screening aid, not a diagnosis.</p>
    </body>
    </html>
    """
    return html
