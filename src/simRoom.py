data = """<23>1<5>0<31>1<4>0<6>1<1>0<2>1<8>0<14>1<1>0<10>1<11>0<2>1<12>0<3>1<2>0<5>1<7>0<7>1<25>0<3>1<2>0<5>1<9>0<5>1<25>0<3>1<2>0<5>1<10>0<4>1<14>0<2>1<10>0<2>1<2>0<3>1<13>0<4>1<11>0<5>1<1>0<3>1<1>0<1>1<2>0<4>1<1>0<2>1<15>0<4>1<10>0<5>1<2>0<2>1<2>0<7>1<1>0<1>1<16>0<3>1<10>0<6>1<1>0<3>1<2>0<7>1<19>0<2>1<9>0<7>1<1>0<3>1<1>0<7>1<20>0<2>1<9>0<6>1<2>2<3>1<1>0<5>1<22>0<2>1<8>0<5>1<4>2<2>1<2>0<3>1<24>0<2>1<7>0<4>1<6>2<2>1<1>0<4>1<24>0<2>1<6>0<5>1<2>2<2>0<1>2<2>1<2>0<3>1<25>0<2>1<6>0<3>1<3>2<4>0<1>1<3>0<3>1<24>0<3>1<5>0<4>1<2>2<10>0<1>1<25>0<4>1<4>0<3>1<1>2<39>0<3>1<3>0<3>1<1>2<24>0<4>1<12>0<3>1<3>0<3>1<1>2<21>0<7>1<12>0<2>1<4>0<2>1<22>0<9>1<11>0<2>1<27>0<5>1<2>0<4>1<10>0<2>1<27>0<2>1<6>0<3>1<10>0<2>1<35>0<2>1<11>0<1>1<35>0<3>1<46>0<4>1<45>0<5>1<43>0<5>1<44>0<3>1<17>0<1>1<48>0<2>1<48>0<2>1<48>0<2>1<47>0<4>1<2>0<2>1<38>0<1>2<3>0<4>1<2>0<1>1<1>0<3>1<39>0<4>1<7>0<1>1<1>0<2>1<25>0<1>2<9>0<4>1<4>0<2>1<27>0<1>2<7>0<1>2<4>0<4>1<3>0<4>1<2>0<1>1<1>0<1>1<25>0<1>2<2>0<1>2<1>0<1>2<3>0<3>1<3>0<2>1<1>0<3>1<3>0<1>1<26>0<1>2<5>0<1>2<2>0<2>1<7>0<4>1<1>0<2>1<2>0<2>1<13>0<1>2<2>0<1>2<2>0<1>2<3>0<1>2<6>0<3>1<4>0<6>1<8>0<1>1<15>0<1>2<1>0<1>2<3>0<6>2<1>0<3>1<3>0<2>1<1>0<5>1<2>0<2>1<2>0<1>1<20>0<9>2<3>1<8>0<3>1<17>0<3>2<1>0<1>2<1>0<13>2<2>1<10>0<3>1<3>0<1>1<19>0<6>2<2>0<4>2<2>1<1>0<1>1<2>0<1>1<4>0<5>1<6>0<1>1<9>0<1>2<1>0<1>2<2>0<6>2<1>0<1>1<2>0<3>2<2>1<1>0<1>1<2>0<3>1<1>0<2>1<1>0<3>1<15>0<1>2<5>0<4>2<2>0<3>1<1>0<3>2<3>1<5>0<1>1<1>0<1>1<2>0<4>1<2>0<1>1<11>0<1>2<2>0<1>2<1>0<6>2<2>0<2>1<1>0<2>2<4>1<10>0<5>1<10>0<1>2<6>0<9>2<2>0<3>2<6>1<7>0<7>1<12>0<1>2<4>0<12>2<9>1<3>0<10>1<13>0<1>2<1>0<2>2<1>0<36>1<5>0"""

def letter(i):
    i = int(i)
    if (i == 1): return str('WW')
    elif (i == 2): return str('SS')
    else: return str('  ')

room = []
data = [a.split('>') for a in data.split('<')[1:]]
room = ''.join([letter(i[1])*int(i[0]) for i in data])
room = '\n'.join([room[i:i+100] for i in range(0, len(room), 100)])
print(len(data))
print(room)