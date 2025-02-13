const body = document.querySelector("body")
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const visualizer = document.querySelector(".visualizer");
const console_log = document.querySelector(".console-log");
const code = document.querySelector(".code");

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

        let vw = window.innerWidth;
        let prevX = e.clientX;

        function mousemove(e) {
            const el_rect = el.getBoundingClientRect();
            const con_rect = content.getBoundingClientRect();
            const cod_rect = code.getBoundingClientRect();
            const sid_rect = sidebar.getBoundingClientRect();
                            
            let diffX = e.clientX - prevX;
            if(el.classList.contains('sidebar') || con_right) el.style.width = 100*(el_rect.width + diffX)/vw + "vw";
            if(el.classList.contains('code') || con_left) el.style.width = 100*(el_rect.width - diffX)/vw + "vw";
            prevX = e.clientX;

            if(el.classList.contains('sidebar')) content.style.width = 100*(con_rect.width - diffX)/vw + "vw";
            if(el.classList.contains('code')) content.style.width = 100*(con_rect.width + diffX)/vw + "vw";
            if(con_right) code.style.width = 100*(cod_rect.width - diffX)/vw + "vw";
            if(con_left) sidebar.style.width = 100*(sid_rect.width + diffX)/vw + "vw";
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

        let vh = window.innerHeight;
        let prevY = e.clientY;

        function mousemove(e) {
            const el_rect = el.getBoundingClientRect();
            const vis_rect = visualizer.getBoundingClientRect();
            const con_rect = console_log.getBoundingClientRect();
                            
            let diffY = e.clientY - prevY;
            if(el.classList.contains('visualizer')) el.style.height = 100*(el_rect.height + diffY)/vh + "vh";
            if(el.classList.contains('console-log')) el.style.height = 100*(el_rect.height - diffY)/vh + "vh";
            prevY = e.clientY;

            if(el.classList.contains('visualizer')) console_log.style.height = 100*(con_rect.height - diffY)/vh + "vh";
            if(el.classList.contains('console-log')) visualizer.style.height = 100*(vis_rect.height + diffY)/vh + "vh";
        }

        function mouseup() {
            body.style.userSelect = "text";
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }
    }
}

document.querySelectorAll(".alg-name").forEach(el => { el.addEventListener('click', loadCode) });

function loadCode(e) {
    let el = e.target;
    let path = './algorithms/' + el.innerHTML + '.html';

    fetch(path)
    .then(res => res.text())
    .then(data => { 
        code.innerHTML = data; 
        hljs.highlightAll(); 
        hljs.initLineNumbersOnLoad();
    });
}