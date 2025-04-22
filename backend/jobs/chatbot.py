import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("API_Key")

def summarize_text(text_to_summarize):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    
    # Truncate input text to save tokens
    max_input_length = 2000  # adjust if needed
    truncated_text = text_to_summarize[:max_input_length]

    payload = {
        "model": "deepseek/deepseek-r1",  # Using your specified model
        "max_tokens": 512,  # Limit output tokens to reduce token cost
        "messages": [
            {
                "role": "user",
                "content": f"Summarize the following text in 5 lines or less:\n\n{truncated_text}"
            }
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    try:
        data = response.json()
    except json.JSONDecodeError:
        print("❌ Failed to decode JSON response.")
        print("Raw response:", response.text)
        return None

    if response.status_code == 200:
        if 'choices' in data and data['choices']:
            return data['choices'][0]['message']['content']
        else:
            print("❌ 'choices' key missing or empty in response.")
            print("Full response:", json.dumps(data, indent=2))
            return None
    else:
        print(f"❌ API Error {response.status_code}: {response.text}")
        return None

if __name__ == "__main__":
    long_text = """
    Zepto is a fast-growing grocery delivery startup that delivers products within 10 minutes. 
    The company is hiring software engineers who have experience in backend systems, microservices, 
    and scalable architectures. Candidates must be proficient in Python and cloud technologies. 
    The role involves working with real-time data, optimizing delivery routes, and ensuring low latency services.
    """

    summary = summarize_text(long_text)

    if summary:
        print("\n✅ Summary:\n", summary)
    else:
        print("\n❌ Failed to generate summary.")
