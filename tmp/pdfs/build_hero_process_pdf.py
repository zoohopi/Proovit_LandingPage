from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output' / 'pdf' / 'proovit_hero_creation_process.pdf'
FONT = Path('C:/Windows/Fonts/malgun.ttf')
BOLD = Path('C:/Windows/Fonts/malgunbd.ttf')
pdfmetrics.registerFont(TTFont('Malgun', str(FONT)))
pdfmetrics.registerFont(TTFont('MalgunBold', str(BOLD)))

W, H = landscape(A4)
BG = HexColor('#0A0708')
PINK = HexColor('#FF2E7E')
IVORY = HexColor('#F4EDE4')
MUTED = HexColor('#BEB0AA')
CARD = HexColor('#171110')

scenes = [
    ('01', '배경', '빈 무대와 핑크 조명으로 - 연출의 세계관을 먼저 고정합니다.', '01_배경.png'),
    ('02', '도형을 그리는 순간', '원·세모·네모가 불꽃을 튀기며 - 그려지는 중간 장면을 정합니다.', '02_도형그리는중_마법불꽃.png'),
    ('03', '도형 완성', '완성된 브랜드 도형의 크기·간격·빛을 - 웹 애니메이션의 기준으로 삼습니다.', '03_배경_발광도형.png'),
    ('04', '프루비 등장', '프루비와 빈 명함의 손 위치를 확정해 - 명함이 손으로 들어갈 목표 좌표를 만듭니다.', '04_프루비_페이드인.png'),
    ('05', '최종 구도', '내비게이션, 캐릭터, 대사, 명함의 - 최종 화면 구도를 검토합니다.', '05_최종구도참고.png'),
    ('06', '별 효과 추가', '좌우 별똥별을 더해 장면의 밀도와 - 시선을 보완합니다.', '06_좌우별추가.png'),
]

def line(c, x1, y1, x2, y2, color=HexColor('#ffffff22')):
    c.setStrokeColor(color); c.setLineWidth(.7); c.line(x1,y1,x2,y2)

def wrap(c, text, x, y, width, font='Malgun', size=9.5, leading=14, color=MUTED):
    c.setFillColor(color); c.setFont(font, size)
    current = ''
    yy = y
    for paragraph in text.split('\n'):
        for ch in paragraph:
            candidate = current + ch
            if pdfmetrics.stringWidth(candidate, font, size) > width:
                c.drawString(x, yy, current); yy -= leading; current = ch
            else:
                current = candidate
        if current: c.drawString(x, yy, current)
        yy -= leading; current = ''
    return yy

def cover_title(c, page, kicker, title, subtitle):
    c.setFillColor(PINK); c.setFont('MalgunBold', 9); c.drawString(42, H-34, kicker)
    c.setFillColor(IVORY); c.setFont('MalgunBold', 22); c.drawString(42, H-62, title)
    c.setFillColor(MUTED); c.setFont('Malgun', 9.5); c.drawString(42, H-80, subtitle)
    c.setFillColor(HexColor('#FFB6D0')); c.setFont('Malgun', 8); c.drawRightString(W-42, H-34, f'{page} / 2')
    line(c, 42, H-94, W-42, H-94)

def image_cover(c, path, x, y, w, h):
    im = Image.open(path); iw, ih = im.size
    scale = max(w/iw, h/ih); nw, nh = iw*scale, ih*scale
    left, bottom = x+(w-nw)/2, y+(h-nh)/2
    c.saveState(); p=c.beginPath(); p.rect(x,y,w,h); c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(im), left, bottom, nw, nh, mask='auto')
    c.restoreState(); c.setStrokeColor(HexColor('#ffffff26')); c.setLineWidth(.8); c.rect(x,y,w,h,stroke=1,fill=0)

def scene_card(c, s, x, y, w, h):
    no, title, desc, image = s
    c.setFillColor(CARD); c.roundRect(x,y,w,h,10,fill=1,stroke=0)
    image_cover(c, ROOT/'제작시안'/image, x+10, y+h-109, w-20, 96)
    c.setFillColor(PINK); c.setFont('MalgunBold', 8); c.drawString(x+12,y+h-126,no)
    c.setFillColor(IVORY); c.setFont('MalgunBold', 11); c.drawString(x+34,y+h-126,title)
    wrap(c, desc, x+12, y+h-143, w-24, size=8.5, leading=11.5)

c = canvas.Canvas(str(OUT), pagesize=landscape(A4))
c.setTitle('프루빗 히어로 제작 과정')
c.setAuthor('PROOVIT')

# Page 1
c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
cover_title(c, 1, 'PROOVIT HERO PROCESS', 'AI와 함께 만든 히어로 연출', '완성 이미지를 한 번에 요청하지 않고, 장면별 기준 이미지를 먼저 만든 과정')
c.setFillColor(HexColor('#1B1016')); c.circle(W-72,H-52,74,fill=1,stroke=0)
card_w, card_h, gap = 245, 226, 18
for i, s in enumerate(scenes[:3]): scene_card(c, s, 42+i*(card_w+gap), 64, card_w, card_h)
c.setFillColor(IVORY); c.setFont('MalgunBold', 14); c.drawString(42, 42, '왜 1번부터 6번까지 이미지로 만들었나?')
wrap(c, 'AI에게 “멋진 히어로를 만들어 달라”고만 요청하면 장면의 순서, 감정, 화면의 우선순위가 흔들릴 수 있습니다. 장면별 시안을 먼저 만들면 배경·도형·캐릭터·명함·대사의 역할을 구체적으로 공유할 수 있고, 웹 구현도 각 장면을 자연스럽게 연결하는 일로 바뀝니다.', 42, 26, W-84, font='Malgun', size=10, leading=14, color=MUTED)
c.showPage()

# Page 2
c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
cover_title(c, 2, 'PROOVIT HERO PROCESS', '시안에서 실제 애니메이션으로', '이미지의 목표 구도와 레이어를 코드의 시간축으로 옮겼습니다.')
for i, s in enumerate(scenes[3:]): scene_card(c, s, 42+i*(card_w+gap), 64, card_w, card_h)
c.setFillColor(IVORY); c.setFont('MalgunBold', 14); c.drawString(42, 42, '이번 작업에서 느낀 점')
notes = [
    ('1. 이미지는 대화의 공통 언어가 된다', '“자연스럽게”라는 말보다 최종 구도와 중간 장면을 같이 보는 편이 훨씬 정확했습니다.'),
    ('2. 마지막 장면을 먼저 정하면 연결이 쉬워진다', '프루비 손의 명함 위치를 먼저 고정하니, 도형이 축소되는 끝점과 캐릭터 등장 타이밍을 정할 수 있었습니다.'),
    ('3. AI 이미지는 레이어로 준비할수록 웹에서 강해진다', '배경·명함·캐릭터를 분리하니 도형과 대사는 이미지에 굽지 않고, 반응형 화면에서도 선명하게 애니메이션할 수 있었습니다.'),
]
x = 42
for heading, body in notes:
    c.setFillColor(PINK); c.circle(x+4, 27, 3, fill=1, stroke=0)
    c.setFillColor(IVORY); c.setFont('MalgunBold', 9.5); c.drawString(x+14, 25, heading)
    x += pdfmetrics.stringWidth(heading, 'MalgunBold', 9.5) + 50
for heading, body in notes:
    pass
# Compact explanatory lines under the three note headings
wrap(c, '시안이 의도와 결과 사이의 오차를 줄였습니다.  |  최종 손 위치가 애니메이션의 목표 좌표가 되었습니다.  |  분리된 레이어 덕분에 화면 크기에 맞춰 자유롭게 움직일 수 있습니다.', 42, 10, W-84, font='Malgun', size=8.5, leading=11, color=MUTED)
c.save()
print(OUT)
