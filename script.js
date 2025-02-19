const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const visualizer = document.querySelector(".content .visualizer");
const console_log = document.querySelector(".content .console-log");
const code = document.querySelector(".code");
const controls = document.querySelector('.controls');
const home_code = code.innerHTML, home_console = console_log.innerHTML, home_visualizer = visualizer.innerHTML, home_controls = controls.innerHTML;

let sidebar_width = 10, content_width = 60, code_width = 30;


/* ====================== RESIZABLE ====================== */


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


/* ====================== SELECT ALGORITHM ====================== */


let states = [];

document.querySelectorAll(".alg-name").forEach(el => { 
    el.addEventListener('click', () => {
        let alg_name;
        if(el.innerHTML == 'Breadth-First Search') alg_name = 'breadth_first_search';
        
        parseStates(alg_name);

        fetch(`./algorithms/${alg_name}/${alg_name}.html`)
        .then(res => res.text())
        .then(data => { 
            code.innerHTML = data; 
            hljs.highlightAll(); 
            hljs.initLineNumbersOnLoad();
        });
    });
});

function parseStates(alg_name) {
    fetch(`./algorithms/${alg_name}/${alg_name}_states.json`)
    .then(res => res.json())
    .then(data => {
        states.length = 0;
        console_log.innerHTML = "";

        for(var i = 0; i<data.length; i++) {
            let state = data[i];
            states.push(state);

            let div = document.createElement('div');
            div.classList.add('console-line');
            div.classList.add('_' + (i+1));
            div.innerHTML = state.log;
            div.style.display = "none";

            console_log.appendChild(div);
        }

        updateStepRange();
        generateVisualizer(alg_name);
    });
}


/* ====================== ALGORITHM CONTROLS ====================== */


function updateStepRange() {
    const steps = controls.querySelector('.steps');
    steps.innerHTML = "";

    for(var i = 1; i<=states.length; i++) {
        let div = document.createElement('div');
        div.classList.add('step');
        div.classList.add('_' + i);
        steps.appendChild(div);
    }

    controls.querySelector('.progress').innerHTML = "0/" + states.length;
    if(states.length) changeStep(1);

    document.querySelectorAll('.step').forEach(el => { 
        el.addEventListener('click', () => {
            changeStep(el.classList.item(1).substring(1));
        });
    }); 
}

function changeStep(x) {
    controls.querySelector('.progress').innerHTML = `${x}/${states.length}`;

    controls.querySelectorAll('.steps .step').forEach(el => { el.classList.remove('active') });
    console_log.querySelectorAll('.console-line').forEach(el => { el.style.display = "none" });

    for(var i = 1; i<=x; i++) {
        controls.querySelector(`.steps .step._${i}`).classList.add('active');
        console_log.querySelector(`.console-line._${i}`).style.display = "block";
    }

    updateVisualizer(x);
}

let playing = false;

function playInterval(el, active) {
    if(playing && active < states.length) {
        changeStep(active + 1);
        setTimeout(playInterval, 1000 / controls.querySelector('.speed').value, el, active+1);
    }
    else {
        playing = false;
        el.style.fill = "var(--light-gray)";
    }
}

controls.addEventListener('click', (e) => {
    let el = e.target;

    if(el.closest('.play-btn') != null) {
        el = el.closest('.play-btn');
        if(!playing) {
            playing = true;
            el.style.fill = "var(--text)";
            playInterval(el, Number(controls.querySelector('.progress').innerHTML.split('/')[0]));
        }
        else {
            playing = false;
            el.style.fill = "var(--light-gray)";
        }
    }

    if(el.closest('.step-prev') != null) {
        el = el.closest('.step-prev');
        let active = Number(controls.querySelector('.progress').innerHTML.split('/')[0]);
        if(active > 1) changeStep(active - 1);
    }

    if(el.closest('.step-next') != null) {
        el = el.closest('.step-next');
        let active = Number(controls.querySelector('.progress').innerHTML.split('/')[0]);
        if(active < states.length) changeStep(active + 1);
    }
})


/* ====================== NAVBAR BUTTONS ====================== */


document.querySelector(".home-btn").addEventListener('click', () => { 
    code.innerHTML = home_code; 
    console_log.innerHTML = home_console;
    visualizer.innerHTML = home_visualizer;

    states = [];
    playing = false;
    controls.innerHTML = home_controls;

    hljs.highlightAll(); 
    hljs.initLineNumbersOnLoad(); 
});

document.querySelectorAll(".nav-btn").forEach(el => { 
    el.addEventListener('click', () => {
        el.classList.toggle('open');

        if(el.closest('.sidebar-btn') != null) {
            console.log("sidebar");
            if(!el.classList.contains('open')) {
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
            if(!el.classList.contains('open')) {
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


/* ====================== VISUALIZER ====================== */


let zoom = 1;

document.addEventListener('wheel', (e) => {
    let el = e.target;
    if(el.closest('.visual-container') != null) el = el.closest('.visual-container');

    if(el.classList.contains('visual-container')) {
        let viewBox = el.getAttribute('viewBox').split(' ');

        let multi = 2;
        if(e.deltaY > 0) { for(var i = 0; i<4; i++) { viewBox[i] = viewBox[i] * multi}; zoom *= multi; }
        if(e.deltaY < 0) { for(var i = 0; i<4; i++) { viewBox[i] = viewBox[i] / multi}; zoom /= multi; }

        // if(e.deltaY > 0) {
        //     viewBox[0] *= 1+(multi * (1 - (e.clientX-rect.left)/rect.width));
        //     viewBox[1] *= 1+(multi * (1 - (e.clientY-rect.top)/rect.height));
        //     viewBox[2] *= 1+(multi * ((e.clientX-rect.left)/rect.width));
        //     viewBox[3] *= 1+(multi * ((e.clientY-rect.top)/rect.height));
        // }
        // if(e.deltaY < 0) {
        //     viewBox[0] /= 1+(multi * (e.clientX-rect.left)/rect.width);
        //     viewBox[1] /= 1+(multi * (e.clientY-rect.top)/rect.height);
        //     viewBox[2] /= 1+(multi * (1 - (e.clientX-rect.left)/rect.width));
        //     viewBox[3] /= 1+(multi * (1 - (e.clientY-rect.top)/rect.height));
        // }
        
        el.setAttribute('viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`)
    }
});

visualizer.addEventListener('mousedown', (e) => {
    let el = e.target;
    if(el.closest('.node') != null) el = el.closest('.node');

    body.style.userSelect = "none";
    if(el.classList.contains('node')) {
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        let prevX = e.clientX, prevY = e.clientY;

        function mousemove(e) {
            let transform = el.getAttribute('transform');
            let translate = transform.substring(10, transform.length-1).split(',');

            translate[0] = Number(translate[0]) + (e.clientX-prevX)*zoom;
            translate[1] = Number(translate[1]) + (e.clientY-prevY)*zoom;

            prevX = e.clientX;
            prevY = e.clientY;

            el.setAttribute('transform', `translate(${translate[0]},${translate[1]})`);
        }
    }
    else {
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        let prevX = e.clientX, prevY = e.clientY;

        function mousemove(e) {
            let viewBox = el.getAttribute('viewBox').split(' ');

            viewBox[0] = Number(viewBox[0]) - (e.clientX-prevX)*zoom;
            viewBox[1] = Number(viewBox[1]) - (e.clientY-prevY)*zoom;

            prevX = e.clientX;
            prevY = e.clientY;

            el.setAttribute('viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`)
        }
    }

    function mouseup() {
        body.style.userSelect = "text";
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});

function generateVisualizer(alg_name) {
    if(alg_name == 'breadth_first_search') {
        
    }
}

function updateVisualizer(x) {
    console.log('updating to', x)
}


/* ====================== GENERAL FUNCTIONS ====================== */


function pixel_to_vw(px) {
    return 100*px/window.innerWidth;
}

function pixel_to_vh(px) {
    return 100*px/window.innerHeight;
}