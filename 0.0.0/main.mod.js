import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";


class gfMOD extends PolyMod {
    GFcar;
    GFspeed = 0;
    GFtime = 0;
    GFlong = [];
    killAll = false;
    init = function(pml) {
        this.anim = document.createElement("style")
        this.anim.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .fade-in {
            animation: fadeIn 2s ease-in forwards;
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        @keyframes tunnelFadeInOut {
          0% {
            opacity: 0;
          }
          16.67% { /* 3s in */
            opacity: 1;
          }
          72.22% { /* hold full opacity for 10s */
            opacity: 1;
          }
          100% { /* fade out over 5s */
            opacity: 0;
          }
        }
        .tunnel {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95) 90%);
          animation: tunnelFadeInOut 18s ease-in-out forwards;
          opacity: 0;
        }
        @keyframes vignetteFadeInOut {
          0% {
            opacity: 0;
          }
          6.67% { /* fade in over 3 seconds */
            opacity: 1;
          }
          72.22% { /* hold fully visible for 10 seconds */
            opacity: 1;
          }
          100% { /* fade out over 5 seconds */
            opacity: 0;
          }
        }
        .vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%);
          animation: vignetteFadeInOut 4s ease-in-out forwards;
          opacity: 0;
        }
        `
        document.head.appendChild(this.anim);
        
        this.GFinfo = document.createElement("p");
        document.getElementById("ui").appendChild(this.GFinfo);
        this.GFinfo.style.position = "absolute";
        this.GFinfo.style.top = "0";
        this.GFinfo.style.right = "0";
        this.GFinfo.style.fontSize = "32px";
        
        this.GFeffects = document.createElement("div");
        this.GFeffects.style.width = "100vw";
        this.GFeffects.style.height = "100vh";
        this.GFeffects.style.position = "absolute";
        this.GFeffects.style.zIndex = "100";
        this.GFeffects.style.pointerEvents = "none";
        document.body.insertBefore(this.GFeffects, document.body.firstChild);

        
        calculate = function() {
            if (!this.GFcar) return;
            const localSpeed = KMHtoMPS(this.GFcar.getSpeedKmh());
            const localTime = this.GFcar.getTime().time;
            const acceleration = (localSpeed-this.GFspeed) / (localTime-this.GFtime);
            this.GFspeed = localSpeed;
            this.GFtime = localTime;
            this.GFlong[0] = Math.round(acceleration * 100)/100;
            this.GFlong[1] = Math.round(acceleration/9.82 * 100)/100;
        }
        
        KMHtoMPS = function(input) {
            return (input / 3.6)
        };
        
        updateGFinfo = function() {
            if (this.killAll) return;
            if (this.GFlong[1] < -500) {
                this.GFeffects.style.background = "black";
        
                
                const fadeImage = document.createElement("img");
                fadeImage.src = "https://i.kym-cdn.com/entries/icons/original/000/029/198/Dark_Souls_You_Died_Screen_-_Completely_Black_Screen_0-2_screenshot.png";
                fadeImage.classList.add("fade-in");
                
                this.GFeffects.appendChild(fadeImage);
            } else if (this.GFlong[1] < -200) {
                const tunnel = document.createElement("div");
                tunnel.className = "tunnel";
                this.GFeffects.appendChild(tunnel);
            } else if (this.GFlong[1] < -50) {
                const vignette = document.createElement("div");
                vignette.className = "vignette";
                this.GFeffects.appendChild(vignette);
            }
            calculate();
            this.GFinfo.innerHTML = this.GFlong.join("<br>");
        };

        
                
        pml.registerFuncMixin("uP", MixinType.INSERT, `{`, `
            ActivePolyModLoader.getMod("gforce").GFeffects.innerHTML = "";
            ActivePolyModLoader.getMod("gforce").GFeffects.style.background = "none";
            ActivePolyModLoader.getMod("gforce").killAll = false;
        `);
        pml.registerFuncMixin("pP", MixinType.INSERT, `yP(this, eP, "f").setColors(n.carColors),`, `ActivePolyModLoader.getMod("gforce").GFcar = yP(this, eP, "f"),`);
        pml.registerFuncMixin("polyInitFunction", MixinType.INSERT, `y.setAnimationLoop((function(e) {`, `ActivePolyModLoader.getMod("gforce").updateGFinfo();`);
        pml.registerFuncMixin("$U", MixinType.INSERT, `),( () => {`, `
            ActivePolyModLoader.getMod("gforce").GFeffects.innerHTML = "";
            ActivePolyModLoader.getMod("gforce").GFeffects.style.background = "none";
            ActivePolyModLoader.getMod("gforce").killAll = false;
        `);
    }
}

export let polyMod = new gfMOD();
