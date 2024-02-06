console.log("lets roll")
let currFolder;
let currsong = new Audio();
let songs;
async function getsong(folder) {
    currFolder=folder
    let a = await fetch(`/${currFolder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
     songs = [];
    let tds = div.getElementsByTagName("a")
    for (let index = 0; index < tds.length; index++) {
        const element = tds[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }
    let aul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    aul.innerHTML=""
    for (const song of songs) {
        aul.innerHTML += `<li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div class="songname">${song.replaceAll("%20", "")}</div>
            <div class="artist">Sirius Black</div>
        </div>
        <img class="invert play" src="play.svg" alt="">
         </li>`
    }
    // // audio.addEventListener("loadeddata",()=>{
    //     let duration = audio.duration
    //     console.log(duration)
    // })
    let as = [];
    as = document.querySelector(".songlist").getElementsByTagName("li")
    for (const it of as) {
        let p = it.querySelector(".play");

        p.addEventListener("click", ele => {

            playMusic(it.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    }
    
}

const playMusic = (track, pause = false) => {

    //    let audio=new Audio("/songs/"+track);
    currsong.src = `/${currFolder}/` + track;
    if (!pause) {
        currsong.play();
        playme.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll(".mp3", "");
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
   
}
function convert(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
let cardContainer=document.querySelector(".cardcontainer");
async function displayAlbum (){
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    for (let index = 0; index < anchors.length; index++) {
        const e = anchors[index];
        if(e.href.includes("/songs/")){
            let folder=e.href.split("/").splice(-1)[0];
            //  console.log(folder)
            
            // console.log(folder);
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML=cardContainer.innerHTML+ `<div data-folder="${folder}" class="card ">
            <img src="/songs/${folder}/cover.jpg "  alt="">

            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`

        }
        
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            await getsong(`songs/${item.currentTarget.dataset.folder}`)
             playMusic(songs[0], true)
        })
})
previous.addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])

    if (index > 0) {
        playMusic(songs[index - 1])
    }
})

next.addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])

    if (index < songs.length - 1) {
        playMusic(songs[index + 1])
    }
})


    
}
async function main() {
    displayAlbum()
    
    //audio.play();
    

    playme.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play();
            playme.src = "pause.svg"
        }
        else {
            currsong.pause();
            playme.src = "play.svg"
        }
    })
    currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convert(currsong.currentTime)} / ${convert(currsong.duration)}`
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = (currsong.duration * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
             console.log(e.target.value);
             currsong.volume=parseInt(e.target.value)/100;
    })
    
     
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
   

}




main();
