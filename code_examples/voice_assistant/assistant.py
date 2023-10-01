import speech_recognition as sr
import pyttsx3
from googlesearch import search
import datetime
import json
import os


engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()



def listen_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1
        audio = r.listen(source)

    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-US')
        print(f"User said: {query}\n")
    except Exception as e:
        print("Say that again, please...")
        return None

    return query



def set_reminder(task, time):
    # Implement reminder functionality, e.g., using sched or other libraries
    pass

def create_todo_list(list_name, tasks):
    todos = {}
    todos[list_name] = tasks
    with open('todos.json', 'w') as file:
        json.dump(todos, file)

def search_web(query):
    for j in search(query, num_results=5):
        print(j)

def show_help():
    commands = {
        "set reminder": "Set a reminder with a task and a time",
        "create to-do list": "Create a to-do list with tasks",
        "search the web": "Search the web for a query",
    }
    for command, description in commands.items():
        print(f"{command}: {description}")


def view_todo_list(list_name):
    if not os.path.exists('todos.json'):
        speak("No to-do lists found.")
        return

    with open('todos.json', 'r') as file:
        todos = json.load(file)

    if list_name in todos:
        tasks = todos[list_name]
        speak(f"Tasks in {list_name}:")
        for task in tasks:
            print(task)
            speak(task)
    else:
        speak(f"No to-do list found with the name {list_name}.")


if __name__ == "__main__":
    speak("Hello, how can I help you?")

    while True:
        query = listen_command()
        
        if query is None:
            continue

        query = query.lower()

        if 'set reminder' in query:
            speak("What is the task?")
            task = listen_command()
            speak("When should I remind you?")
            time = listen_command()
            set_reminder(task, time)
            speak("Reminder set successfully")

        elif 'create to-do list' in query:
            speak("What is the name of the list?")
            list_name = listen_command()
            speak("Tell me the tasks, separated by the word 'and'")
            tasks_input = listen_command()
            tasks = tasks_input.split('and')
            create_todo_list(list_name, tasks)
            speak("To-do list created successfully")

        elif 'search the web' in query:
            speak("What do you want to search for?")
            search_query = listen_command()
            search_web(search_query)

        elif 'help' in query:
            show_help()

                # Add this condition in the main loop
        elif 'view to-do list' in query:
            speak("Which to-do list do you want to view?")
            list_name = listen_command()
            view_todo_list(list_name)

        elif 'exit' in query:
            speak("Goodbye!")
            break

        
