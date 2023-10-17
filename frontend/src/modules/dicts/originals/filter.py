import json 

# read json files and parse
with open ('adjs.json', "r") as a_file:
    adj_json = json.loads(a_file.read())

with open ('nouns.json', "r") as n_file:
    noun_json = json.loads(n_file.read())


# filter lists based on length
adj_list = adj_json['adjs']
noun_list = noun_json['nouns']

filtered_a = []
for i in range (0, len (adj_list)):
    if (4 < len(adj_list[i]) < 8):
        filtered_a.append(adj_list[i])

filtered_n = []
for i in range (0, len (noun_list)):
    if (4 < len(noun_list[i]) < 8):
        filtered_n.append(noun_list[i])

# print stats and save
print(f'Adjectives: {len(adj_list)} -> {len(filtered_a)}')
print(f'Nouns: {len(noun_list)} -> {len(filtered_n)}')

with open ('../adjs_filt.json', "w") as a_file:
    a_file.write(json.dumps({
        "adjs": filtered_a
    }))

with open ('../nouns_filt.json', "w") as n_file:
    n_file.write(json.dumps({
        "nouns": filtered_n
    }))