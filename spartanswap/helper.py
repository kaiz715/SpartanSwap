import os

def replace_in_file(file_path, old_string, new_string):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        content = content.replace(old_string, new_string)
        print(file_path)
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
    except UnicodeDecodeError:
        # Skip files that cannot be read with utf-8 encoding
        pass

def replace_in_directory(directory, old_string, new_string):
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            replace_in_file(file_path, old_string, new_string)

directory_path = '.'
# replace_in_directory(directory_path, 'http://localhost:5001', 'http://localhost:5001')