var banner = $('.b-standard'),
    stickScene;

$(document).ready(function() {
    /* Events */
    banner.on('click', function(e) {
        var inAddClickTag = $(this).data('landing');

        if (inAddClickTag)
            redirectTo(inAddClickTag);
        else
            redirectTo(window.clickTag);
    });

    /* Loop through scenes */
    $('[data-type=scene]').each(function(index, item) {
        var sceneType = $(this).data('scene'),
            totalChildrens = ($(this).children().length - 1);

        if (sceneType)
            stickScene = $(this);

        /* add animationend event */
        $(this).children().each(function(index, item) {
            /* add .animate on first item */
            if (index === 0)
                $(this).addClass('animate');

            $(this).on('oanimationend msAnimationEnd animationend', function(e) {
                /* remove and readd .animate on next element */
                $(this).removeClass('animate').next().addClass('animate');

                /* all children animated*/
                if (index === totalChildrens)
                    $(this).parent().addClass('completed');

                /* get return scene and replay with another class */
                var elementType = $(this).data('type');
                if (elementType)
                    stickScene.addClass('replay');
            });
        });
    })
});

function redirectTo(redirectURL) {
    window.open(redirectURL, '_blank');
}