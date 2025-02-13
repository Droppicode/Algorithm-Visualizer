const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const visualizer = document.querySelector(".visualizer");
const console_log = document.querySelector(".console-log");
const code = document.querySelector(".code");
const home_code = code.innerHTML;

let sidebar_width = 10, content_width = 60, code_width = 30;

document.querySelectorAll(".resizable-right").forEach(el => { el.addEventListener('mousedown', mousedownHor); });
document.querySelectorAll(".resizable-left").forEach(el => { el.addEventListener('mousedown', mousedownHor); });
document.querySelectorAll(".resizable-up").forEach(el => { el.addEventListener('mousedown', mousedownVer); });
document.querySelectorAll(".resizable-down").forEach(el => { el.addEventListener('mousedown', mousedownVer); });

function mousedownHor(e) {
    let el = e.target;
    if(el.closest('.content') != null) el = el.closest('.content');
    if(el.closest('.sidebar') != null) el = el.closest('.sidebar');
    if(el.closest('.code') != null) el = el.closest('.code');

    const rect = el.getBoundingClientRect();

    let left_border = rect.left;
    let right_border = rect.left + rect.width;

    if((Math.abs(e.clientX - left_border) <= 5 && el.classList.contains('resizable-left')) || (Math.abs(e.clientX - right_border) <= 5 && el.classList.contains('resizable-right'))) {
        body.style.userSelect = "none";

        let [con_left, con_right] = [false, false];
        if(Math.abs(e.clientX - left_border) <= 5 && el.classList.contains('content')) con_left = true;
        if(Math.abs(e.clientX - right_border) <= 5 && el.classList.contains('content')) con_right = true;
        
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        let prevX = e.clientX;

        function mousemove(e) {
            const el_rect = el.getBoundingClientRect();
            const con_rect = content.getBoundingClientRect();
            const cod_rect = code.getBoundingClientRect();
            const sid_rect = sidebar.getBoundingClientRect();
                            
            let diffX = e.clientX - prevX;
            if(el.classList.contains('sidebar') || con_right) el.style.width = pixel_to_vw(el_rect.width + diffX) + "vw";
            if(el.classList.contains('code') || con_left) el.style.width = pixel_to_vw(el_rect.width - diffX) + "vw";
            prevX = e.clientX;

            if(el.classList.contains('sidebar')) content.style.width = pixel_to_vw(con_rect.width - diffX) + "vw";
            if(el.classList.contains('code')) content.style.width = pixel_to_vw(con_rect.width + diffX) + "vw";
            if(con_right) code.style.width = pixel_to_vw(cod_rect.width - diffX) + "vw";
            if(con_left) sidebar.style.width = pixel_to_vw(sid_rect.width + diffX) + "vw";

            if(el.classList.contains('sidebar') || con_left) sidebar_width = pixel_to_vw(sidebar.getBoundingClientRect().width);
            if(el.classList.contains('code') || con_right) code_width = pixel_to_vw(code.getBoundingClientRect().width);
            content_width = pixel_to_vw(content.getBoundingClientRect().width);
        }

        function mouseup() {
            body.style.userSelect = "text";
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }
    }
}

function mousedownVer(e) {
    let el = e.target;
    if(el.closest('.visualizer') != null) el = el.closest('.visualizer');
    if(el.closest('.console-log') != null) el = el.closest('.console-log');

    const rect = el.getBoundingClientRect();

    let top_border = rect.top;
    let bottom_border = rect.top + rect.height;

    if((Math.abs(e.clientY - top_border) <= 5 && el.classList.contains('resizable-up')) || (Math.abs(e.clientY - bottom_border) <= 5 && el.classList.contains('resizable-down'))) {
        body.style.userSelect = "none";

        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        let prevY = e.clientY;

        function mousemove(e) {
            const el_rect = el.getBoundingClientRect();
            const vis_rect = visualizer.getBoundingClientRect();
            const con_rect = console_log.getBoundingClientRect();
                            
            let diffY = e.clientY - prevY;
            if(el.classList.contains('visualizer')) el.style.height = pixel_to_vh(el_rect.height + diffY) + "vh";
            if(el.classList.contains('console-log')) el.style.height = pixel_to_vh(el_rect.height - diffY) + "vh";
            prevY = e.clientY;

            if(el.classList.contains('visualizer')) console_log.style.height = pixel_to_vh(con_rect.height - diffY) + "vh";
            if(el.classList.contains('console-log')) visualizer.style.height = pixel_to_vh(vis_rect.height + diffY) + "vh";
        }

        function mouseup() {
            body.style.userSelect = "text";
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }
    }
}

document.querySelectorAll(".alg-name").forEach(el => { 
    el.addEventListener('click', () => {
        fetch('./algorithms/' + el.innerHTML + '.html')
        .then(res => res.text())
        .then(data => { 
            code.innerHTML = data; 
            hljs.highlightAll(); 
            hljs.initLineNumbersOnLoad();
        });
    });
});

document.querySelector(".home-btn").addEventListener('click', () => { 
    code.innerHTML = home_code; 
    hljs.highlightAll(); 
    hljs.initLineNumbersOnLoad(); 
});

document.querySelectorAll(".nav-btn").forEach(el => { 
    el.addEventListener('click', () => {
        el.classList.toggle('closed');

        if(el.closest('.sidebar-btn') != null) {
            console.log("sidebar");
            if(el.classList.contains('closed')) {
                console.log("fechando");
                sidebar.style.width = 0;
                content.style.width = (content_width + sidebar_width) + "vw";
            }
            else {
                console.log("abrindo", sidebar_width)
                sidebar.style.width = sidebar_width + "vw";
                content.style.width = (content_width - sidebar_width) + "vw";
            }   
            content_width = pixel_to_vw(content.getBoundingClientRect().width);
        }

        if(el.closest('.code-btn') != null) {
            console.log("code");
            if(el.classList.contains('closed')) {
                console.log("fechando");
                code.style.width = 0;
                content.style.width = (content_width + code_width) + "vw";
            }
            else {
                console.log("abrindo", code_width)
                code.style.width = code_width + "vw";
                content.style.width = (content_width - code_width) + "vw";
            }   
            content_width = pixel_to_vw(content.getBoundingClientRect().width);
        }
    }); 
});


/* ====================== GENERAL FUNCTIONS ====================== */


function pixel_to_vw(px) {
    return 100*px/window.innerWidth;
}

function pixel_to_vh(px) {
    return 100*px/window.innerWidth;
}