var init = function () {
    gBoard1 = ChessBoard('board1', {
        showNotation: gNotation
    });
};

var start = function () {
    gBoard1 = ChessBoard('board1', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'start'
    });
};

var fen = function () {
    var ruyLopez = $('#fenInput').val();
    gBoard1 = ChessBoard('board1', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: ruyLopez
    });
};

var pos = function () {
    var position = {
        d6: 'bK',
        d4: 'wP',
        e4: 'wK'
    };
    gBoard1 = ChessBoard('board1', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: position
    });
};

var white = function () {
    gOrientation = 'white';
    gBoard1.orientation(gOrientation);
    gBoard2.orientation(gOrientation);
    gBoard3.orientation(gOrientation);
}

var black = function () {
    gOrientation = 'black';
    gBoard1.orientation(gOrientation);
    gBoard2.orientation(gOrientation);
    gBoard3.orientation(gOrientation);
}

var multi = function () {
    gBoard2 = ChessBoard('board2', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'
    });
    $('#board2').show();

    gBoard3 = ChessBoard('board3', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1'
    });
    $('#board3').show();
}

var single = function () {
    gBoard2.destroy;
    $('#board2').hide();
    gBoard3.destroy;
    $('#board3').hide();
}

var toggleNotation = function () {
    gNotation = !gNotation;
}

var freeform = function () {
    
}

var play = function () {
    var game = new Chess(),
        statusEl = $('#statusInfo'),
        fenEl = $('#fenInfo'),
        pgnEl = $('#pgnInfo');

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function (source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    var onDrop = function (source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';

        updateStatus();
    };

    // update the board position after the piece snap 
    // for castling, en passant, pawn promotion
    var onSnapEnd = function () {
        gBoard1.position(game.fen());
    };

    var updateStatus = function () {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
    };

    var cfg = {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'start',
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    gBoard1 = ChessBoard('board1', cfg);

    updateStatus();
}
