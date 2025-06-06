let songs;
let currfolder;
async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let got = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < got.length; i++) {
        const element = got[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" width="34px" src="img/music.svg" alt="">
                            <div class="songinfo">
                                <div class="songname">${song.replaceAll("%20", " ")}</div>
                                <div class="artist"> Mubeen</div>
                            </div>
                            <div class="playnow">
                                <div>Play Now</div>
                                <img class="invert playplay" width="34px" src="img/plays.svg" alt="">
                            </div>
                         </li>`
    }
    // .replaceAll("320 Kbps.mp3", " ")
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".songname").innerHTML.replaceAll(" ", "%20").trim())
        })
        console.log(e.querySelector(".songname").innerHTML)
    });
    return songs
}

function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Make sure no decimal part

    // Format both parts to always have 2 digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}.${formattedSeconds}`;
}


let currentsong = new Audio()
const playmusic = (track, pause = false) => {
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg"
    }
    play.src = "img/plays.svg"
    currentsong.src = `/${currfolder}/` + track
    document.querySelector(".songinfoo").innerHTML = track.replaceAll("%20", " ").replaceAll("320 Kbps.mp3", "")

}
async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

    
    if (e.href.includes("/songs")) {
        let folder = e.href.split("/").slice(-2)[0];
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
        let response = await a.json()
        console.log(response);
        document.querySelector(".cardcontainer").innerHTML = document.querySelector(".cardcontainer").innerHTML + ` <div data-folder="${folder}" class="card">
                            <div class="playbut"><img src="img/ply.svg" alt="">
                            </div>
                            <img src="/songs/${folder}/cover.jpeg" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
}

async function main() {
    displayalbum()
    songs = await getsongs("songs/cs")
    var audio = new Audio(songs[0]);
    playmusic(songs[0], true)

    document.getElementById("play").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/plays.svg"
        }

    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
        currentsong.currentTime = currentsong.duration * ((e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
    })
    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".box1").style.left = "0"
        document.querySelector(".cross").style.display = "block"
    })
    document.querySelector(".cross").addEventListener("click", () => {

        document.querySelector(".box1").style.left = "-100vw"
        document.querySelector(".cross").style.display = "none"

    })
    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }
    })
    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 > length) {
            playmusic(songs[index + 1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

    })
document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("img/volume.svg")){
        e.target.src=e.target.src.replace("img/volume.svg","img/muted.svg")
        currentsong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
         e.target.src=e.target.src.replace("img/muted.svg","img/volume.svg")
        currentsong.volume=.10
        document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
})



}
main()
