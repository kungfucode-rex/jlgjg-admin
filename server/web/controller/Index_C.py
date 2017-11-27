# -*- coding=utf8
import web, random, string
from StringIO import StringIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter

#生成验证码的位数
vcodeLength = 4
#生成验证码图片的尺寸
vcodeSize = (60, 25)
#背景颜色, 默认白色
vcodeBgcolor = (238, 238, 238)
#字体颜色, 蓝色
vcodeFontcolor = (0, 0, 255)
#干扰线, 红色
vcodeLinecolor = (255, 0, 0)
#是否要加干扰线
isDrawLine = True
#加入干扰线的上下限
vcodeLineNumber = (1, 5)

#随机字符串
def gen_text():
    source = list(string.letters)
    for index in range(0, 10):
        source.append(str(index))
    validateCode =  ''.join(random.sample(source, 4))
    web.config._session['validateCode'] = validateCode
    return validateCode

#绘制干扰线
def gen_line(draw, width, height):
    begin = (random.randint(0, width), random.randint(0, height))
    end = (random.randint(0, width), random.randint(0, height))
    draw.line([begin, end], fill = vcodeLinecolor)

#生成验证码图片
def gen_code():
    width, height = vcodeSize
    image = Image.new('RGBA', (width, height), vcodeBgcolor)
    font = ImageFont.truetype('arial.ttf', 25)
    draw = ImageDraw.Draw(image)
    text = gen_text()
    font_width, font_height = font.getsize(text)
    draw.text(((width - font_width) / vcodeLength, (height - font_height) / vcodeLength), text, font = font, fill = vcodeFontcolor)
    if isDrawLine:
        gen_line(draw, width, height)
    image = image.transform((width + 20, height + 10), Image.AFFINE, (1, -0.3, 0, -0.1, 1, 0), Image.BILINEAR)
    #image = image.filter(ImageFilter.EDGE_ENHANCE_MORE)
    out = StringIO()
    image.save(out, 'png', quality=75)
    return out.getvalue()

class index:
    def GET(self):
        return web.template.frender('index.html')()

class get_validate_code:
    def GET(self):
        web.header('Content-Type', 'image/png')
        return gen_code()

class check_validate_code:
    def GET(self):
        if 'validateCode' in web.config._session:
            return web.config._session['validateCode'] == web.input().validateCode
        else:
            return None
