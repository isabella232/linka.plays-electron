import axios from 'axios'

import { readFile, writeFile } from 'fs/promises'

async function main() {
  const cwd = process.cwd();
  const voiceoverdir = cwd + '/public/voiceover/files/'

  const json = JSON.parse(await readFile(cwd + '/public/voiceover/phrases.json', 'utf-8'))
  for (const key in json) {
    if (Object.hasOwnProperty.call(json, key)) {
      const element = json[key];
      try {
        const cacheText = await readFile(voiceoverdir + element + '.cache.txt', 'utf-8')
        if (cacheText === element) continue
      } catch (error) {
        //     
      }
      console.log('download '+ key);
      const audio = await  getAudio(element);
      await writeFile(voiceoverdir+key+'.mp3', audio)
      await writeFile(voiceoverdir+key+'.cache.txt', element)
    }
  }
}

main()

async function getAudio(text, voice = 'alena') {
  const response = await axios.post("https://us-central1-distypepro-android.cloudfunctions.net/tts", {
    text,
    voice
  }, {
    responseType: 'arraybuffer'
  })
  return response.data
}