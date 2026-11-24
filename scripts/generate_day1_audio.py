import asyncio, pathlib, subprocess
import edge_tts
out=pathlib.Path("audio")
out.mkdir(exist_ok=True)
phrases={"menya-zovut-anna":"Меня зовут Анна.","do-svidaniya":"До свидания!","dobroe-utro":"Доброе утро!","dobry-den":"Добрый день!","dobry-vecher":"Добрый вечер!","a-tebya":"А тебя?","mne-tozhe":"Мне тоже.","do-vstrechi":"До встречи!"}
phrases.update({"privet":"Привет!","zdravstvuyte":"Здравствуйте!","kak-tebya-zovut":"Как тебя зовут?","ochen-priyatno":"Очень приятно!","poka":"Пока!","kak-vas-zovut":"Как вас зовут?","menya-zovut-mariya":"Меня зовут Мария.","menya-zovut":"Меня зовут…","ya-anna":"Я Анна.","menya-zovut-masha":"Меня зовут Маша.","a-ty":"А ты?","dobro-pozhalovat":"Добро пожаловать!","horosho-spasibo":"Хорошо, спасибо.","kak-dela":"Как дела?","molodets":"Молодец!","otkuda-ty":"Откуда ты?","ya-iz-ispanii":"Я из Испании.","ya-iz-meksiki":"Я из Мексики.","ya-iz-rossii":"Я из России.","ya-student":"Я студент.","ya-uchitel":"Я учитель.","nika-russian":"Привет! Меня зовут Ника. Давай учить русский вместе.","nika-welcome":"Привет! Я Ника. Давай практиковать русский язык.","nika-help":"Я помогу тебе с уроком и произношением.","nika-name":"Как тебя зовут? Меня зовут Ника.","nika-course":"Начнём с первого урока."})
dialogs=["Привет! Привет! Как тебя зовут? Меня зовут Анна. Очень приятно! Мне тоже. Пока! Пока!","Добрый день! Здравствуйте! Как вас зовут? Меня зовут Мария. Очень приятно! Мне тоже. До свидания! До свидания!","Добрый вечер! Добрый вечер! Я Анна. А тебя? Меня зовут Мария. Очень приятно! Мне тоже. До встречи!"]
async def main():
 for name,phrase in phrases.items():
  await edge_tts.Communicate(phrase,"ru-RU-SvetlanaNeural").save(str(out/(name+".mp3")))
 for i,phrase in enumerate(dialogs,1):
  await edge_tts.Communicate(phrase,"ru-RU-SvetlanaNeural",rate="-10%").save(str(out/("day1-dialog-"+str(i)+".mp3")))
 for name in [*phrases,*["day1-dialog-"+str(i) for i in range(1,4)]]:
  subprocess.run(["ffprobe","-v","error",str(out/(name+".mp3"))],check=True)
asyncio.run(main())
