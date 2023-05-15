var lis = document.querySelectorAll('li');
var ul = document.querySelector('ul');
var obj;
var initX, initY, firstX, firstY;
var arr = [].slice.call(lis);
var a = -1, b = -1;
var intercambiabilidad = 0;
function indexar(arr) {
    a = -1, b = -1;
    var indice = 0;
    arr.forEach(
        function (li) {
            li.setAttribute('indice', indice);
            indice++;
            makeDragable(li);
        }
    );
}
function dumpCSSText(element) {
    var s = '';
    var o = getComputedStyle(element);
    for (var i = 0; i < o.length; i++) {
        s += o[i] + ':' + o.getPropertyValue(o[i]) + ';';
    }
    return s;
}
function makeDragable(ref) {
    ref.addEventListener(
        'mousedown',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            intercambiabilidad = 1;
            var clon = ref.cloneNode(1);
            clon.style.cssText = dumpCSSText(ref);
            ul.insertBefore(clon, ref);
            ref.style.position = 'absolute';
            ref.style.opacity = '.5';
            ref.style.left = clon.offsetLeft + 'px';
            ref.style.top = clon.offsetTop + 'px';
            ref.style.zIndex = 1000;
            obj = ref;
            a = obj.getAttribute('indice');
            initX = this.offsetLeft;
            initY = this.offsetTop;
            firstX = e.pageX;
            firstY = e.pageY;
            window.addEventListener(
                'mousemove',
                dragIt,
                false
            );
            window.addEventListener(
                'mouseup',
                function () {
                    this.removeEventListener(
                        'mousemove',
                        dragIt,
                        false
                    );
                    intercambiar();
                },
                false
            );
        },
        false
    );
    ref.addEventListener(
        'touchstart',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            intercambiabilidad = 1;
            var clon = ref.cloneNode(1);
            clon.style.cssText = dumpCSSText(ref);
            ul.insertBefore(clon, ref);
            ref.style.position = 'absolute';
            ref.style.opacity = '.5';
            ref.style.left = clon.offsetLeft + 'px';
            ref.style.top = clon.offsetTop + 'px';
            ref.style.zIndex = 1000;
            obj = ref;
            a = obj.getAttribute('indice');
            initX = this.offsetLeft;
            initY = this.offsetTop;
            var touch = e.touches;
            firstX = touch[0].pageX;
            firstY = touch[0].pageY;
            obj.addEventListener(
                'touchmove',
                swipeIt,
                false
            );
            obj.addEventListener(
                'touchend',
                function () {
                    this.removeEventListener(
                        'touchmove',
                        swipeIt,
                        false
                    );
                    intercambiar();
                },
                false
            );
        },
        false
    );
}
function checkSuperposicion() {
    b = -1;
    arr.forEach(
        function (li) {
            var ow = li.offsetWidth / 2;
            var oh = li.offsetHeight / 2;
            var x = li.offsetLeft + ow;
            var y = li.offsetTop + oh;
            var x2 = obj.offsetLeft + ow;
            var y2 = obj.offsetTop + oh;
            if (Math.abs(x - x2) <= ow && Math.abs(y - y2) <= oh) {
                li.style.opacity = .5;
                if (li.getAttribute('indice') != obj.getAttribute('indice'))
                    b = li.getAttribute('indice');
            } else {
                li.style.opacity = 1;
            }
        }
    );
}
function dragIt(e) {
    var dist = initX + e.pageX - firstX;
    var dist2 = initY + e.pageY - firstY;
    e.preventDefault();
    e.stopPropagation();
    obj.style.left = dist + 'px';
    obj.style.top = dist2 + 'px';
    checkSuperposicion();
}
function swipeIt(e) {
    var contact = e.touches;
    var dist = initX + contact[0].pageX - firstX;
    var dist2 = initY + contact[0].pageY - firstY;
    e.preventDefault();
    e.stopPropagation();
    obj.style.left = dist + 'px';
    obj.style.top = dist2 + 'px';
    checkSuperposicion();
}
function intercambiar() {
    if (!intercambiabilidad) {
        return;
    }
    intercambiabilidad = 0;
    if (obj && obj.parentNode)
        obj.parentNode.removeChild(obj);

    arr = [].slice.call(document.querySelectorAll('li'));
    var pa = arr[a];
    var pb = arr[b];
    if (pa) {
        pa.style.opacity = 1;
    }
    if (pb) {
        pb.style.opacity = 1;
    }
    if (b > -1) {
        arr.splice(a, 1)
        arr.splice(b, 0, pa);
    }
    renderizar();
}
function renderizar() {
    var fragment = document.createDocumentFragment();
    arr.forEach(
        function (li) {
            var clon = li.cloneNode(1);
            clon.style.opacity = 1;
            clon.style.cssText = dumpCSSText(li);
            fragment.appendChild(clon);
        }
    );
    ul.innerHTML = '';
    ul.appendChild(fragment);
    arr = [].slice.call(document.querySelectorAll('li'));
    indexar(arr);

    // My code:
    let i = 1;
    let correctOrder = true;
    for (let li of arr) {
        if (li.getAttribute('id') != 'e' + i) {
            correctOrder = false;
            break;
        }
        i++;
    }
    if (correctOrder) {
        document.getElementById("secret").style.visibility = 'visible';
    }
}
indexar(arr);