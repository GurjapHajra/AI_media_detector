n = [1,2,3,4,5,6]

res = []

for i in range(0, len(n)-1, 2):
  res.append(n[i]+ n[i+1])

print(res)