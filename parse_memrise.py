import json

with open('top_1000_spanish_raw.json', 'r') as json_file:
    data = json.load(json_file)

# print(data['levels'][0]['words'][0])

for level in data['levels']:
    for word in level['words']:
        word['meaning'] = [w.strip() for w in word['meaning'].split(',')]

with open('top_1000_spanish.json', 'w') as json_file:
    json.dump(data, json_file)
