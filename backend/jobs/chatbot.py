import requests
import json
import os
from dotenv import load_dotenv
# Set your OpenRouter API key (store it safely)
load_dotenv()  # Load environment variables from .env file
API_KEY = os.getenv("API_Key")

def summarize_text(text_to_summarize):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
       
    }
    payload = {
        "model": "deepseek/deepseek-r1",  # ⚡ Correct Model ID for DeepSeek R1
        "messages": [
            {
                "role": "user",
                "content": f"Summarize the following text in 5 lines or less:\n\n{text_to_summarize}"
            }
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        data = response.json()
        return data['choices'][0]['message']['content']
    else:
        print(f"Error: {response.status_code} {response.text}")
        return None

if __name__ == "__main__":
    # Example text
    long_text = """
    Zepto is a fast-growing grocery delivery startup that delivers products within 10 minutes. 
    The company is hiring software engineers who have experience in backend systems, microservices, 
    and scalable architectures. Candidates must be proficient in Python and cloud technologies. 
    The role involves working with real-time data, optimizing delivery routes, and ensuring low latency services.
    """

    summary = summarize_text(long_text)

    if summary:
        print("\nSummary:\n", summary)
    else:
        print("\nFailed to generate summary.")
