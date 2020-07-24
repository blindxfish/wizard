
const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
});

function drawit(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = c.getImageData(0,0,imageWidth,imageHeight);
    c.clearRect(0,0,canvas.width, canvas.height);


    class Particle{
        constructor(x,y,color, size){
            this.x = x+ canvas.width/2 - png.width *2,
            this.y = y+ canvas.height/2 -png.height *2,
            this.color = color,
            this.size = 2,
            this.baseX = x+ canvas.width/2 - png.width*2,
            this.baseY = y+ canvas.height/2 -png.height *2,
            this.density = (Math.random() * 10 + 2);
        }
        draw(){
            c.beginPath();
            c.arc(this.x,this.y,this.size,0,Math.PI * 2);
            c.closePath();
            c.fill();
        }
        update(){
            c.fillStyle=this.color;

            //collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let forcedirectionX = dx / distance;
            let forcedirectionY = dy / distance;

            //max distance past what the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force < 0 ) force = 0;

            let directionX = (forcedirectionX * force * this.density * 0.6);
            let directionY = (forcedirectionY * force * this.density * 0.6);

                if(distance < mouse.radius + this.size){
                    this.x -= directionX;
                    this.y -= directionY;
                }else{
                    if(this.x !== this.baseX){
                        let dx = this.x -this.baseX;
                        this.x -= dx/20;
                    }
                    if(this.y !== this.baseY){
                        let dy = this.y -this.baseY;
                        this.y -= dy/20;
                    }
                } 

            this.draw();

            }
        }


    function init(){
        particleArray = [];

        for(let y = 0, y2 = data.height; y<y2; y++){
            for(let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[(y*4*data.width) + (x*4) +3] > 128){
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y*4*data.width) + (x*4)] + "," +
                                        data.data[(y*4*data.width) + (x*4) + 1] + "," + 
                                        data.data[(y*4*data.width) + (x*4) + 2] + ")";
                    particleArray.push(new Particle(positionX *4 ,positionY *4,color))
                }    
            }
        }
    }


    function animate(){
        requestAnimationFrame(animate);
        c.clearRect(0,0,innerWidth,innerHeight);

        for(let i=0; i<particleArray.length; i++){
            particleArray[i].update();
        }
    }
    

init();
animate();


}

window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = this.innerHeight;
        init();
    })


window.addEventListener('load', (event) => {
    console.log("page is loaded");
    c.drawImage(png, 0, 0);
    drawit()
})

var png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA/CAYAAAAWq21gAAAgAElEQVR4Xt2cB3hVRf73P6fcm0IKLRB6R2lSBEHXhl1BUBQpiqDwFxYVdZFioakobVUQFAtFUJqoNAVkUUFFegkthE4gnYT0W8458z4zNwkBQnNxlXd8fIB7z50zM9/59e+Mxv8fTSxdtJR2D94PCHTDJWelXY1TuyoHXWyhnZjtu7TGTRqAJgIYyD/Q0Q1tF9DkagPlagVk88wZs69/oscTaJofT24+Feq0QhcadevUZPO67zBNN0I4V938rrYBB4WGlvLk5GZh+f0Yuouy0Q1x0BAIpaMsoZOXvJOT6ZmUr1DuapvfVaVncxxHlBK2jW4KqtdoTUZOHobbxPHl8tsvK3j2pSFs27ybjOQ9aJqGaZrjgCFXk9q63B10AKhTbII1gGP/gwkL4ThKCrweh8q1m+Hz+TDR2bl9Naap4zgOsfHxPNS+J21aNmLld19hmOZfYdyVFStoqUCFy1mfSwHkoQYNrv12z57t5/SracEeIORyXni5zzZs0FDs2hmDpuvUaXATySmpOLqLeTMmcEOrFgFFJQJrsCv+CJ3ufwp0jayU3Wz8fSNt/nHjpczxcod1vuenCeF5+uwv+/cfwEcffbIE6HixF11ssI4QHvVMpzfW893GpKL+vMse4k8GpN5nn82I69XzCTQ0ykQ3QTc1LNtiz5ZV6IaJrp85/D3xR+n5+HPkZGaTkbQXTQNNN64Htl5sIa7Q9wqQoPaLirprWD2cbR/eqf6tacEXldgLASKE8LBiczIdR/5+znj/ZEBarFy+astd996B3+OlXNXmuEydh9rdxTtvDUZoRonrl5qVxdGEBLp17sfLz/Vm+PCXMQz17MU23hXCg3MAKey4861V+WJwS6KiqpKWlnbe8Zzvix+E8Nz98feHGfDhjhIH+ycCUvu7ZSsO3nPPnaSmZlCvyT+UWvpt9WLKlwtjb2I8DavXwBAamZ58Vq36lUcevFuNURc6MfFHeKR9T2XUT6Xs5eMPP+Gfz/b9ywGR46tZMZR90+6RkiJ1rF7SwpY40FmzposePbpTXPSK/7jLbVWZNajln6KyJk78UDz/bD9SUlKod93tWLbDwV1rVby3P/EYfsuPbroY8sIwfLl5/LB8Pk6BGdWExs7jh3mk3VMKkIzEncgvDbe7HJB+pcTgAv0oCRn4yU6mfncIyy5u3wO/OvHl/ZSLcKPrIRKQcx4oCZDHhfB8EfzgokJbeYbdkP+QHk1SUjJVqtRaCHS+UhOtXr2GOHzoAJYlKFelCboOcTvW4OCoV8QlHMdxoP293bm+aUMWzv8Y+6xJ7z1yhEOHjvPSC6/x64/LaNy4Pqahpvm/kJJSR47E5VSsWIHgYGUvCOmwGKdwxxQsVIF2KXFMJQ1S2Y6zpUN2kpycTHR0je+BdlcKhGL9CNuyENiUrtgEx7HZv/NX0ByEEGTmZHMyL5/77+yKO8hk355f8eXlKUko3jJyc0hKT6PTg71xHIvs1P3cedc9/Pjjqv8FIMWH0nnYsFcXvPHG8BLXsmLFaqSkpJ4zpnM+uPXWW8RPP/9AyIOLz5hoAarPAVP+BDC625bzpYy3IyrWR9eD+XnlAipVKkviyVQsyyHLk0/HB55U7m9Wyl4SExNLHIb8fu/x43S8rweaJshK3QWWgebSI4GsP2HsF+rSLYTHO25BHMNm7Sl6bs2EW2lzbVmp8i8OyP79u0V0lRqU67ysqIOFw1rzYOtKJXZwJSb4/PMDxfvvj+f/+g5k/jfLuLlNS6Z/9h5J6cms/GkdzZpcx/btW3n7jSlsX7+asAgD27ZLfLUuYOeJoyycs4x5c74h6dgOlddyuzT5AxUp/i9b3759xEdTJxNczBUuG+4icW47uZ7n2JFzEBLCI/Yey6ZZ/9VF4/713duoEJRNzZr1/wyxTxe2VUYarMhKAVW1c+sPuNwu9sYfZebH8/j2m+WYhgvdQBnqxKSU866pjWDPieMYwuFhGSRik5EUR7369Th8+MCfMf4L4vvAA/eJ775bdIbakjYtd3FHCUgokF+8gxIB2XUki+uf+/F/AsjXixaKh9o/TMXq15Hv8fHNshlEhJUi3+fHdmyEHzp1CLixIS6dwwc2k5mZecFFyMjPIzE9jYfuexLh6GSn7ZIRIm+OHsuoEcOkbZEZBumMnFYDf5LYXASQMCD37wRIom3b0brmEF6hIboh+HrpbBDSkOtousBAZ+CLr3MgLp60+F2czJDpoZKbBE16gNl5+ZxIT6V7l75kZ3lJjd9GcLAbTdNV9C6dBITGhs1buLF1K9nZnxbNX1WAVKlaXxyLj6FmnZtJz8hk0fdfoJmCX1dvYPIHn+L12gSSigFPKzd1N0mp6WrRS2qJmemczMrCkOl4XUP4dTp16KGkQzgydQFhpdxMnfQOHdvfj6PLfhx0YRBSKhKPJycaSL6SwnK1ADKhVFjkwMy0VBzDpmx008DOlZGS46DrhoqBbPV3GUAENGtK/HZOnTqFLRw8Hj8pOafIy/eoHwpNoOkabs2gSlQUOZ48kk+l81iHZ/D7BW4XWLJeJWyl/mTAaRo6749/i15PdsS2DEzdIjSiHJ78nLeAYVcCmL8zIOK+Bx5m6aKv1II4uty1fmK2x3HH/Y8UFZjq1qzK+l9XYBrg9Vvk5WZT69pbiIwMY8Pa5Wh6wLuSEqPLPoQI9Oc4RTGJ/Ez+vzchnkfb98InBN8v/4KoiNKULxWCppnccW9Xjh5PxHAZ2JbDjyvn06JFU3QJrOxPQNu297B2zSr5uj/sDPwtAXmwYyex6OuvcbCR9kI4ghvbdmZ/3CGVOvf7ffyyeiFNmzYmOeVMjXHw4DEeeLinyjKs/3kpEZGhGIYLVZ3VLLV4cvFNTVcSpRm6NA84ls2GXfvp9UQ/9cz0mROJjIoo2vRBQUHUq1CRjb9v5clnhoIhkIHpDS2uY9V3sxGGqcamayZt297PmrUr/xAof0dAhJDekoCIig2UYdXlDrRlmsnPU9078cGksSoLIB+SFqOwSd5CvUb/QDPdBVLh4LcELpe0EjKosLih1fXUrlGT48mJ/LzmF3Q9CKnnHCECZV6Z7RU6pgu+WjrjXOmyBU1r12bAwOF8t3IttrBxLAeX240l7VbCHjA0pQ7/iKT87QCpVaehOBi3i8gKjTB00M0gggwvB2I3ElqqFMeOxeNyKdpOia1ek7bIBPqYj97gl6UrWPb9L1iOjmkaSKCLp04CqksVHjBwqFE9kiBhERsf8CwXLpuu1FzxplQeEGy4qFWpCv68fFrf9gA+y4Xt+LEsm7y0vVSpXouEhOOXLSV/O0BCQsJFbm4m1zS6haTUVL6aPY3rmtY6X/b59FppAscWNGx+F6XLhfPy8AHErl2HpaQtIEU6Utc7Kp0iP9u2bVsJHpjDocR8/F6bpStmU3J8f9ZesB12bNnLqJHjqVapAjHbVhMSGo7f5736AQEWOLa3s7SLkZWaKjfziS6dGDroGUzdVC7p2QnCwPIIflu3laf6DmTClLfZ9vPPGMKHdU7COrDDAx9rbNq06bRxR8btUr5MDhzJ5L0P3qJmvarnlUYh4x/b4YN3Z/DzmnV4vX686XEB8p1pfgT0v1zP64pIyLQVR+g/+XQNfcPE2zHzE2jSpMVl75CgoFDhycrGNqQmEURENVT6WHYUt/MXhLBKnKN84p/PDmX1L+tV+rp65bLceuN1ymBfqG3evLnoa4FOUloOOfnSnRbcfmcbXni53/l/bsuq5OOKViR1X3bqXgzTpaTP5XJj29Zlz//uu+8UP/zw3RmpE0PXyFuiUiflgZPFB3T2C+YK4el6duo9ZX473hs/llGj3rqcAdWb8O6UuBdf6IuGzUOdn2HN2o044rTSCEiGzU/LF1K5cnklLWfqd4116zbz9D8lk8ePUGhIr8rCdBlUqxxFZHgYbrcbv99PSlo6KWmnsGxNhnvowlLOhKEZjB73Ktc2kYSZ0++Q79eFQ2LCSfr1Hijr75JcVzQE23Zod+/tzJ/9kQo033rzbUaMHFYdiL9USYmICBeZmaklpuBLqrHLGcro9Cbga1kHkd5JSan3MmUqcupU5qUCUnbx0pUn27e7A1++TVT163AZBl4BpiMlQsdlubBMH37dxhBStYQQ6tb5fPpkmjaui24Yqnbu2NJmOKry99y/XufHNeuxVYCnoWl2IBYpiEFkwKjLZIsesC033dyKwUNfQBgy0pdOnKPcbk2YxO49wJCXR2BoprI7QjOVI6BUn1RdapQCp2CTnDyxE9NlMnvWXHr2ejwcyLlEUCwhPMbZm/zw5/dRuVxwIfGhN7BREmc0md0t7Dgty0eV7rL+dGYrqIWsAW6/lEHcfNs94sfVi8nN9FHtmtY4jh8Dm4hW/QhtM1DpeMMReAwTw2+R8N1LaMdWgqMFmCTSZVVLKyhfPozRI4fStFEDypYvA5oEypJhvGT7qN9Iox6QNYt9J45jqV1uKhc761QWe3fv48Mp08nKyFMcYMeWjkDALdClq139DryV2yLw4RIuZXdkZtmVuhlxYJHKAsgY58SBrYRHhtL6hpvYsmXjpW7O1kJ41styRk7+mer5x7G38I9GsrocaJoW3F0Bcr7auXwo4+sH0YWfkJDSlzoA2/bbuow1wqIboctwMKo21bp8j4OFJs6t7R9Z/zVBhoNn6yiCrdMqozAKl+NwRMCVlTvd0QNROsLAsiwlffJPmXJxNEupKLnrJbiybiI/D0w4EEQWNiMoAl/zoWBp2Kb/jL1Ws5XMHhhKVWVM74AvIw7H0MhK3i3ZFBiG6QOCLmWDduz4oFi06KvzchRkHwWb/r0LAvLQjZWZ/9oNl8QnKhxYcmqiKF+2POHlG6gAMLLliwTf2Fcl/EpqGjqHNs1DdzmU2v4Z/twEZQ8qRZdj8Au9eGXUZNxWBEdmVWXR714m/nCCA4dt8px8lXtynBBs4cFlguMzwBQKoMY1y/Bcc0G7lplEDxUYQvDvd17krTGfkpGVq5gsWpm6eOr3KHFctVt2LqjkB77O/OUd8mJmSZniVMouklPSiY6ucKmbtI8Qnk+TMjzU6LGixPddEiDZizrgNqVbGnwv8MMl7Aa/1/aZjlcQVbUZft1Fzf6bS+RRySDR58nkeMwKgm0X+Qk/4DqxHg0vdWtXo+9Tj6gAb9CwiWjC5tTcxhTyGYxgF3h1ktMsypezsTPT8GelcNxfgXp1qyAcn0rbW5ogPyGG6i9LawAT3hyEg48pU+cTn5Ck8lXe6ndClbtBeM/ggMh31WrVRUl4YUuY2hzd8pEaH4MrWBL19Ayg7CWsi5mdneYPCws7r5RcEiCFotSx46MsWbLsoruhx9MDxcypb1OmSjMs2yb6+d1gWphWIPWhVI+mJB48mRyOWanSdq4Nb2NoOUrnL/tmBsFBIcpQS5bivR17I/MsmXMaYBcQ5HIth+q99pD2aQ20kPAiQHT8lH3VTdq7EQRHVVHua96JndQYHFCTAUD8OI6Gz2sx4p3J6j2OVG2tRqmo5XTT0V06NZp1KvrIJ+Dkhw2V+34qOZbOjz3B1wvnXHRddF0Xtp136Sqr8I1PjNvMV2uPnwG4y9DICZQbHwG+ucBu0JyCQkXpig3B8hE1IBYHE2kmizepyg5unK90etDWt8Dvp17tqnw8ebS01erzwmCxU+c+ZOfmcW8jL7Oeq8qRY2m0HOfgd3Q0EcKEdqfofVtpPlglGLncQTdz8GluYl4JIjoC+kz2sOq4i3JlQhn0rz5npVpsRo/7lFNZPmwjDF+zQWhGsVhemJghoVRudB+6ZmNqED+5cUCFpcZiezy4QkIuCoi00zNXHaXvxG1nra1OzuIORZ9pWvBrsrNZQI/GjRuxc+cW4lPzqfvUyjN+eCEeUbEHWzmOb6OwTcpWaVREQjAsHdvlEFHrdsLv/wCfpZGwfaHyiIKyjkDsbEJdBssWzyqyMtLwxsfHU716dekrcWf7nngteR5Estxt5fW4cUlbjMu28UsXWSVSbKVipPNb6AorF9hyGDv6RUzDLDLqRcZd2LwyYlKA1OZ247Qaim6ZeHRDOQfmvtlo6fuQ0ifd8MLfZafEqsKZbpjXAvsusFGXC+G572zHqV+72kz853V06fI4CxZ8LX8u+bo3nY1uiT6zBOSBBzqyfPkFU9Ca35fhGGYk3Xs+S25mNmvWyUBQJg79ivppyyWXKksuoIpHpNo22LX5e1JTT5dmZREqIiKCLVu20LJlS7UIGzduZvjoSTzc/j76PfN40fwzMrJ4fdR4uj1yP6GlAuQ0qfoWLVrJ+m276f34w9SpW115ZTVr1uTw4cPnrp2AQcMnowr4xVqAoCdBdHDJgpkmuOvmmwiPDOPzmZPIy88mrFTkxSTkvDw3lytMeodn/P6czqR4DfpsJ5MWHSwa2q6P7+JAzG8SlAu+3OUOEV5PtiqXRlRshCEt97X9scIq4hh+9D1z0TJiVURc2FG9ujX4aOKbRS6pBKFVq1YKhD179uDxeBQLsH79+rhMN5ohU/fFon0dOj7SlYnjx3AyPcAWjY6uqHi+oWGhRJaWNtdR1NTt27dTrtxpv79wgtLTe2fCx6RlZJ+h0pxydfHX7aFikODcRPQ9n6jQMSM+ECS6g4OxLP8F16R582Zi69b1Z9gPqbLzlyozUBk4g2BWIiB/kHVyVAinulQVZaIbYwmbSs/vVZLx8i0f8dx7USpxZ2kOIY6BtmWUMtYnDmxi3/59aiEkGNu27qJ3nyfVGc5DR4+xft06uj/ejd27d9OoUaMzKoOy1tHpsW54bYvypUsz87NPlKoMxCA62dnZHDt2jDq1ajNj1mwaN2lEWKhk3mhs2byD61teV7TpZDb4lTcmIjQdX4txOK5cguV/QV4yPWDqDroTgrFxiIqJspP3qCBTN0xpGFqcT2VdkeTiHwHk9RHvizeHD6BKrcake3zU7rUSf6nqbBg8ALfU4wTxxPT+rFiyXXlZQVuHq4WLP/A7cXEHVOpcSsXCb1bx9ltDinT1l3PnseDrb9nw269kpKXitf2Eh5QiJLwUbW5pq/hbDevVZc/+g/g9Hr6ZPxeX21RuhGYLFTB26NqdJ7t0pm6d2kX1kCkffs6z/WUlsoCFArz82rvoQaXJb/YSEEF4aDonZq2nzYRx5NmlAjYq+yBHP3+IahUi2R2zlr79BjBj+tTzSslfBcgwx3He0ByboKjGBBlQ6dkAdTJPt9g9ZIiiDDZ9e4IKFvNOHSN77v3YFpw4/DuxsXHs37+f3OwcFnyzmjFvDyY3N5dQtZshLi6OV199Db/LpTK/UqdL6ejWsQM33XQTVatWZefOnezcEcP8xUtRBfmChXYjeHfcWPW8VFsBG6Mxeeocnu/bRTkAhc8OHTEJ/A7WTcOl1eO5R44xsmcy/xg7ghx/MEHCh60HkzGpBb58nczcjWh+N5pbk6emAuXIs9pfAkhwcIjIysqgVeu7iD2UQI2X9qmyqWymnovuDyPHEASZeQgrlKzEY+Qv64jjySfhyGZi98UpVROzfQeTpn7J9E8mnDEtqX6kNMndLj0tuftVSsQw1L8LmzyDKD/zebxKwgw9kGiUAWZaWpry3AoX/+3xH/OaTMUX/FyC9NLQ8Zilosm7boCShs3vnaDr3BdoUD6BSlEnGH/fx7y7rhfTN91G8qTGtGhQn59+/lYdJhKBVPTfA5CTWadE2fBIwspfQ5jtEPF8nCK5yeZoAsPWEQX/1jUfvtwc0rYswd41jl0bVpGamoQmBJu37mTIa++weuW8ooUrqg4WVAXnzp1Lt27dzph4IF9VcqGrMH8lwZCeXNmyZUk/eYohw8Yz5o1BaIqbBbk5PkaOmQItXsNjyiysQ41Wj6lxKRAtjS0j+tP6jSnYusOJyfURhouclL3sitnDdU2b/G0ACXH8uXlCd1M6uony/4Mbd6dc21dxHJOWNfYRGp7Lz3sb4RdBfNppIs989U+SNi/C3PAmOl7W/GeB2v0rVv7EuPen8ePyL5R3JXNa0v2VoBw8eJDatWszbfpM+vR+ipCQEPLzC2ixmiAtOY3yFaLO2aGS42uhKZUmT+5GR0eTkpqi7MXwwf2JiJCLD4OGjkPoOt42kpIlE5gWdW/oiM8XguYKbCrZDNsm9afXyI9drMoGaUl7VQRkumU27dwK8V+isuQG8nskn8lHZLWm6JZB+O0DKNWkN3P7jKdOZDI3vDuBRuWO82Wf8QjhJ7LLbei/jCTUDfH7txEXt4fFy1bx/pQvWP395xw6dIi8vDwaN26sAJGLKQtR2Tm5hIeVok6dOuoZ2eRSjXp7DK+/MkTZiuLMxmPHj1O9alXlNMgmAc46lcm/Xn2fV1/uSdmyZVT94+XhEzGFTn6bEQGJMBzS5//M8CV9+W53ExUUGo5G3uYJpG34TKX+M1NilSTpshR9Hu7WXwUIURWqiaSkYwhbUDr6WizdRWSr/pS5/v8QMhCUul7Wq7t+wM1V4yj31AO4fPnovw3D7/jY8OO3/PTbel4b+R4/Lp+tXGDZWrRoUUSGk1Ikc2RBbjfXXHONMvZqN0ume9fH+Xbul8q2FGexdOzalcXz5qkYpHnz5uzYsQPL8jJ4+CTGjHgeQzf51+vvYuo6ua1HoRXQVFXNRvip1OZRDGGiOTp56/9N1pbpaukzEnYhNIcyZaLIzj5/4e4vA0TukBHDxjqvvf6SmmRkxQaqdhFZ51aCOkzCZQcSjDJlIo83246LhE3fYuz7HNL3EqrrTJo4jGcGvMHsz94nKeEwQtNUpC53fPrJk0SVj2JP3D6urV9fARIbGxtQURp0eKwb741+Q1FLmzQpuHPGETzSrTsL583hxIkT1KhRQ5EgklLSmTBpJu+NfonBIyaq6zicqJuxa9x5Vs1eUON6mXU2Sf/2KbwJv6sEZObxnZhuNy++OIhJk/59wcDwrwRErc2Uj6aJvv/3lKrIhZerj8tl4ujBVO27SXqUxXhROrlpcaQd2UHIhrH47Szckj2ou9GwGPfmyyqxYvkErVq3UDu8WbNmPNGrJ19+Pot69eqxb18goJQq7eEu3Rk+9GW1Ca6/XpLZoc8z/Zj64WS279pBTmYet916MzE7Yhj02gSVypcntmTuSwSF4Ws6qCibXGSIhAGOF9fO99C9OSrxmZ0auLZj3LgJDB06+GJpE/5yQORkxo6dKAYNeg7NtilVobGatOaC0s/sJ8QIeDW2rKXrkLBtNT5vHuaOMWh5pzA0HUc3+M/SaWzfHsOO3Qd5+snObNu2lebNW9Dhsa4sWTCPatWqcfTo0aLMcMfOXRn56mAFiFRNsnV+/EmmT51CRERpYmL2UbduFWJjY/jXK5MKfgd6SCT+Ji/g1VyqZFzYlHelBeHa+Cqa48URporOhSF4SUnGxIuCIfv6rwHJykoVwggh6rHTZ1lWjbmZVnVKERpa5pIGIQfSqEkbsX3rb8jrRspXvBaP1weuMGr2/hG/Yr8EmrQtiXvWkpd3iAiPhr1tJJoWRNUqUQzo1x1NGHR6pCsHDsUi6TNTP/6E557trzyw4nyujo91Y/SwVxRzpXHDRnTo3IWv53yBK0gyUiSNBzZt2szYd2eQnpGNrYF946sYwkBmo3Rx1mm33JO494xBs0Nwm5CWuFuBXbvOtRw5cvCS16Fbty5izpzPz8hlFStpyMzrGYX2czp+/vn+4t/vTSCso7yaI9Bk4JOzqINMhl0jA+eiLy7yF8NwCW9evrq9Z+267bTv1F1VqMzgEEo//TtBWogyjNJNsrMzSIz7Cb+dT/D6N9WCLZk/nf37djDwtUn8vHKmWtggl5uuT/Zi3uzpmK4g5X3J6P/Rbj1YMGeW8sykUZdusXQC5Encu9o/zZIFk9mybS8jR0/BEF58rUfjSGJ2sRq7W40lAmPDK4ohKZfql//Mo8l112DqLunaSnt2yWDI5fH5csR/tp/koVGnb8N4t28Tnn2wzqUd+gwODhb5+adK5BE9/fQzzJgx65xjWBfBJdfyeUJ1w4082B8SVR+5Q/y6SaVHZxMR3Zw8S3J0A37+id3L8eTnUWqjPHrmMG3y28yZv4Sdu+KY++Wk0ypF01Q6/ciRI+jC5qc1v3J729vPWGAZLLZ/uBdPdu+CodtM/mw+hmWRd+Ob6vhDkZTKSrn0AjPjCD04R9VP5DmS9MRdyqVNTkqgUuWqacC5gc4FJh8WFiays9NKXMs+ffoxbdrMc8AtCe21QnhuObug4jJOV7fef/8D5s1bwIYNmxoABa7OBWG5sdOjT6xbOP9zVWHYvCmGu9s9qlSABKJa/xjlJiszq+kc2/StkmT3ppFoth/TpeOzBO3uuZWBLz5T9CLp4sq4Y/mK/3Dv3W0DdKBi59aHDB3Fpu0HMAtYKZIVb7UeiSPppepQboHaFILg9W+oz2whWPvDNzRreq0qE9x7z738Z/UqWSbcfSmaoXz5cqJ376eQ59Nl3HT7oLX8vvfMSyQu9+IACrlaJdGDHm9bjekDA17MH7gNSDg+D47mxjAcOjzam5/WbJR0BHQzhPL9tqkgT3dsjmyRNiwP1+Z3wQmw1+Vi164ZzeefTcTr9arPJCAHDx2iVo0aiuQnm7zqr1vP50g6mRnga4l89KCK+Fs8jxDy6r+CtI6p497wDpqVr2576PjAvcyYOgbDHRQ4EHT5F9cUXc80Zv4+Rszeew6GfR+oxaT+8sTYuSdw1RzPg7qqclV5/HvSMiX96Nz2X1w+UzEismxS6smTshaH7Xi58aZ27D+WrE4vObqfyk9tx5OfzYl9PxfcMmrC5n8T7M/EL9mPus6uLd+TmHACLRAlB4BAIyMrhw5d/k9RrCUwdnAp7OuHKHKcJNmZjsDWLFybRiOz07LuUr/hNWxYsyTAbNQhJCQMr9dTSu2Iy2vnvQ2osJuLlcPPa6CioyuKxMSjqr4u6+xnt/8CkMKuZvbp81LPjz8aq+IlxqEAAALsSURBVFSNzA7fff9jbNgqLxOVdE8o1/4TktKSlOF3NEMl+jR/Mu5tU9BlIUo36d2jC10fvZfJU79gyYqfELZUewL/9QMQrrIqayslUuaItdyjuHZ+KrvH0TRubdOMZUu+VGcYJU+rU6fHWLx44WTg+cvDoejp8wJSeDb9iy/m0KPH0+dd9wt6DOXKlRVpaQnqbSXdffIHVFZJ8/y17z+H/OODiaMwXEGKgzXtsy95ceg7agc7Lk0x0K3mr2Ors38OpjBwxc6B7L3Yjjx2FqCgKlZj6Tp46z2BIeVPZnItCN70prxdA8P2Kq7u9A/H0OmRduq4mmy9evZm9hczJe9M8s/+m1YiIDs+upNrq4Xz1ltjGDZs5AXX/FJcuKxjxw6EV6t27rmKKwRI4QLMrlS56hPHjxxCd8kjALaSmpp1W3AyK08eAUQEh6PnZeC5cRSGVhqh5ajLapycdPwRUQQJE0f40A0d/dcROLoPwwlWF2pUCA9n3+5fVcpD1uQltyqqQiXS09NkYemca/n+IColXvEns9KhoWWkP1PyzWvFXnYpgBQ+PhfoescdbZkx4xMiIyMpXbrCNJmh+IODP9/P5MnMTOG1sE1D8aEUqUF3UaZifTTcyiV1GaD7feSEhmA1eYXQLW8rQrfXFuryS9ux0Pw+sk4dkdUsfLKa6XKzNzaWhg2kc8gfsREXneqKFUtF69Y3MHjwK3z66XT5vCxTVrzoDwseuBxALrXPK/lcSlRUhaiUpOOo3IsGftunzhZ269qbVb/EYNuSNioteOBygPvuvIm5X05Vdkn+JwnShiUoH12RkyfTpJfQ9koO8Er39XcHpHC+cs29devWNeL2xSmCmqytS5dX0ify8v2EBEl1JXGRx+Tk0TSNWnVqcezYUekmyptTS77+4Uqv6H/Z39UCyNnT/DfwrzFjxjN44Es4uqTg6Yx+czzDR74qnx0LDP0v1+Yv+fnVCkjxxZJ0RWmY5V1M8pafq7r9Py2PWkrjdvU3AAAAAElFTkSuQmCC";
