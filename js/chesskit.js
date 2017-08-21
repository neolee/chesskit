var init = function () {
    var board1 = ChessBoard('board1');
};

var start = function () {
    var board1 = ChessBoard('board1', 'start');
};

var fen = function () {
    var ruyLopez = $('#fenInput').val();
    var board1 = ChessBoard('board1', ruyLopez);
};

var pos = function () {
    var position = {
        d6: 'bK',
        d4: 'wP',
        e4: 'wK'
    };
    var board1 = ChessBoard('board1', position);
};

var multi = function () {
    var board2 = ChessBoard('board2', {
        position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
        showNotation: false
    });
    $('#board2').show();

    var board3 = ChessBoard('board3', {
        position: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1',
        showNotation: false
    });
    $('#board3').show();
}

var single = function () {
    ChessBoard('board2').destroy;
    $('#board2').hide();
    ChessBoard('board3').destroy;
    $('#board3').hide();
}

var config = function () {
    var board1,
        game = new Chess(),
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
        board1.position(game.fen());
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
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    board1 = ChessBoard('board1', cfg);

    updateStatus();
}
