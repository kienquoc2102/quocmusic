const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $(".player")
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevtBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "B.S.N.L 1",
            singer: "Bray & YoungH",
            path: "./music/bsnl1.mp3",
            image: "./img/bsnl.jpeg"
        },
        {
            name: "B.S.N.L 2",
            singer: "Bray & YoungH",
            path: "./music/bsnl2.mp3",
            image: "./img/bsnl2.jpg"
        },
        {
            name: "B.S.N.L 3",
            singer: "Bray & YoungH",
            path: "./music/bsnl3.mp3",
            image: './img/bsnl3.jpg'
        },
        {
            name: "Tíc Tắc",
            singer: "Bray",
            path: "./music/tictac.mp3",
            image: './img/tichtac.jpg'
        },
        {
            name: "Bước đều bước",
            singer: "Bray",
            path: "./music/buocdeu.mp3",
            image: './img/buocdeu.jpg'
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function(){
        const _this = this
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        //Xu li CD quay va dung
        const cdThumbAnimate = cdThumb.animate([{transform: 'Rotate(360deg)'}], {
            duration: 10000, //10s
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        //Xu li scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            if (newCdWidth > 0)
                cd.style.width = newCdWidth + "px";
            else
                cd.style.width = 0;
            cd.style.opacity = newCdWidth / cdWidth; 
        }

        //Xu li bam nut play
        playBtn.onclick = function() {
            if(_this.isPlaying)
            {
                audio.pause()
            }
            else 
            {
                audio.play()
            }
        }
        //Khi song duoc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        //Khi song bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if (audio.duration)
            {
                const progressPercent = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //Tua
        progress.onchange = function(e){
            const seekTime = (e.target.value * audio.duration) / 100
            audio.currentTime = seekTime
        }
        //Khi bam nut next
        nextBtn.onclick = function(){
            if (_this.isRandom)
            {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollActiveSong()
        }
        //Khi bam nut prev
        prevtBtn.onclick = function(){
            if (_this.isRandom)
            {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollActiveSong()
        }
        //Khi bam nut random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //Tu dong phat
        audio.onended = function() {
            if (_this.isRepeat)
                audio.play()
            else
                nextBtn.click()
        }
        //Repeat Song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollActiveSong: function(){
        
        setTimeout(()=>{
            $(".song.active").scrollIntoView({
                if()
                {

                }
            })
        }, 300)
    },
    start: function(){
        //Lang nghe cac su kien
        this.handleEvent();

        //Dinh nghia cac thuoc tinh cho Object
        this.defineProperties();

        //Render playlist
        this.render();

        //Tai thong tin bai hat vao UI khi chay ung dung
        this.loadCurrentSong();
    }
}

app.start()
