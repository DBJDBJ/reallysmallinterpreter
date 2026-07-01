/*
    jQuery One-liners
    -----------------
    Press CTRL+ENTER to evaluate any line.
    Copy/paste individual snippets and run them one at a time.


    ELEMENTS & STYLING
    ------------------

    Toggle a class:
        $('#myButton').click(() => $('#box').toggleClass('active'))

    Change multiple CSS rules:
        $('.text').css({ 'color': 'red', 'font-size': '16px', 'background': '#fff' })

    Smoothly reveal/hide:
        $('#toggleDiv').slideToggle('slow')

    Fade out and delete:
        $('.alert').fadeOut(300, function() { $(this).remove(); })


    DOM TRAVERSAL & SELECTION
    -------------------------

    Find closest matching parent:
        $(this).closest('.container').addClass('highlight')

    Select all sibling items:
        $(this).siblings().removeClass('selected')

    Check if element exists:
        $('#myElement').length

    Clear all form fields:
        $('form#myForm')[0].reset()


    EVENTS & INTERACTION
    --------------------

    Simple click toggle:
        $('#menu-btn').on('click', () => $('#menu').toggle())

    Disable button on click:
        $('button').click(function() { $(this).prop('disabled', true); })

    Scroll smoothly to top:
        $('html, body').animate({ scrollTop: 0 }, 'slow')

    Delegate events dynamically:
        $('#list').on('click', 'li', function() { $(this).toggleClass('done'); })


    AJAX & CONTENT
    --------------

    Load HTML into a container:
        $('#result').load('snippet.html #targetContent')

    Fetch and parse JSON API:
        $.getJSON('api/data', data => console.log(data))

    Update element text safely:
        $('.username').text(newUserName)


    DUMP / INSPECT
    --------------

    Dump any object readably (real newlines and tabs):
        JSON.stringify($("body").html(), null, "\t").replace(/\\n/g, "\n").replace(/\\t/g, "\t")

*/
