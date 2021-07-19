var left = $('#the-l-column');
var leftParagraphs = left.find('p, h1, h2, h3, h4, h5, h6');
var right = $('#the-r-column')
var rightParagraphs = right.find('p, h1, h2, h3, h4, h5, h6');
var col_state = null;

const bil_align = () => {
    /* 如果页面宽度大于 800px，进行段落对齐，见下一节 */
    if(window.matchMedia('screen and (min-width: 480px)').matches) {
        leftParagraphs.each((i, thiz) => {
            if (i < rightParagraphs.length) {
                var left = $(thiz);
                var right = rightParagraphs.eq(i);

                left.removeAttr('style'), right.removeAttr('style');

                /* 取对应两段高度的最大值 */
                var maxHeight = Math.max(left.height(), right.height());
                left.height(maxHeight), right.height(maxHeight);
            }
        });
    } else {
        leftParagraphs.removeAttr('style'), rightParagraphs.removeAttr('style');
    }
};

const column_hidden = (i) => {
    if (i != undefined) {
        col_state += i;
        col_state = Math.max(-1, col_state);
        col_state = Math.min( 1, col_state);
    }

    if (col_state < 0) {
        left.hide();
        right.show();
        right.width('auto');
        rightParagraphs.each((i, thiz) => {
            $(thiz).height('auto');
        });
    } else if (col_state > 0) {
        left.show();
        right.hide();
        left.width('auto');
        leftParagraphs.each((i, thiz) => {
            $(thiz).height('auto');
        });
    } else {
        left.show();
        right.show();
        left.width('');
        right.width('');
        bil_align();
    }
};

const when_ready = () => {
    if (_col_hid_pre_state != undefined) {
        col_state = _col_hid_pre_state;
    }
    else if (col_state == null) {
        if (document.location.search == '?left') {
            col_state = 1;
        } else if (document.location.search == '?right') {
            col_state = -1;
        }
    }
    column_hidden();
}

var resizeHandler = 0;
/* 监听窗口大小变化 */
$(window).resize(() => {
    if(resizeHandler) {
        clearTimeout(resizeHandler);
    }
    resizeHandler = setTimeout(when_ready, 500);
});

if($('.content-bil img').length) {
    $('.content-bil img').ready(when_ready);
} else {
   $(when_ready);
}

if(document.fonts) {
    document.fonts.ready.then(function () {
        when_ready();
    });
}