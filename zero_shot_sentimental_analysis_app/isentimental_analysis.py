import openai
import streamlit as st
from dotenv import dotenv_values



def gpt_classify_sentiment(prompt, emotions):
    system_prompt = f'''You are an emotionally intelligent assistant.
    Classify the sentiment of the user's text with ONLY ONE OF THE FOLLOWING EMOTIONS: {emotions}.
    After classifying the text, respond with the emotion ONLY.'''
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role' : 'user', 'content': prompt}
        ],
        max_tokens=20,
        temperature=1.2
    )
    r = response['choices'][0].message.content
    if r == '':
        r = 'N/A'
    return r



#text = 'AI will take over the world!'
#result = gpt_classify_sentiment(text,emotions)
#print(result)

if __name__ == '__main__':
    config = dotenv_values(".env")
    print(config)
    openai.api_key = config['OPEN_API_KEY']
    assert openai.api_key.startswith('sk-'), 'Error loading the API key. The API key should start with "sk-""'
    print(openai.api_key)
    col1, col2 = st.columns([0.85, 0.15])
    with col1:
        st.title('Zero-Shot Sentimental Analysis')
    with col2:
        st.image('ai.png',width=70)

    with st.form(key='my_form'):
        default_emotions = 'positive, negative, neutral'
        emotions = st.text_input('Emotions:', value=default_emotions)
        
        text = st.text_area(label='Text to classify:')
        submit_button = st.form_submit_button(label='Check!')

        if submit_button:
            emotion = gpt_classify_sentiment(text, emotions)
            result = f'{text} => {emotion} \n'
            st.write(result)


