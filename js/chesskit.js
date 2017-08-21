var fenNormalize = function (_pos, _active, _castling) {
    return _pos + ' ' + _active + ' ' + _castling + ' - 0 1';
};

var makeConfig = function (_pos, _game) {
    var statusEl = $('#statusInfo'),
        fenEl = $('#fenInfo'),
        pgnEl = $('#pgnInfo');

    var removeGreySquares = function () {
        $('#board1 .square-55d63').css('background', '');
    };

    var greySquare = function (square) {
        var squareEl = $('#board1 .square-' + square);

        var background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d') === true) {
            background = '#696969';
        }

        squareEl.css('background', background);
    };

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function (source, piece, position, orientation) {
        if (_game.game_over() === true ||
            (_game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (_game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    var onMouseoverSquare = function (square, piece) {
        // get list of possible moves for this square
        var moves = _game.moves({
            square: square,
            verbose: true
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        // highlight the square they moused over
        greySquare(square);

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    };

    var onMouseoutSquare = function (square, piece) {
        removeGreySquares();
    };

    var onDrop = function (source, target) {
        removeGreySquares();

        // see if the move is legal
        var move = _game.move({
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
        gBoard1.position(_game.fen());
    };

    var updateStatus = function () {
        var status = '';
    
        var moveColor = 'White';
        if (_game.turn() === 'b') {
            moveColor = 'Black';
        }
    
        // checkmate?
        if (_game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }
    
        // draw?
        else if (_game.in_draw() === true) {
            status = 'Game over, drawn position';
        }
    
        // game still on
        else {
            status = moveColor + ' to move';
    
            // check?
            if (_game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }
    
        statusEl.html(status);
        fenEl.html(_game.fen());
        pgnEl.html(_game.pgn());
    };
    
    var config = {
        orientation: gOrientation,
        showNotation: gNotation,
        position: _pos,
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    
    updateStatus();

    return config;
};

var init = function () {
    gBoard1 = ChessBoard('board1', {
        showNotation: gNotation,
    });
};

var start = function () {
    gBoard1 = ChessBoard('board1', makeConfig('start', new Chess()));
};

var fen = function () {
    var ruyLopez = $('#fenInput').val();
    gBoard1 = ChessBoard('board1', makeConfig(ruyLopez, new Chess(ruyLopez)));
};

var pos = function () {
    var position = {
        a4: 'bK',
        c4: 'wK',
        d7: 'wR'
        };
    gBoard1 = ChessBoard('board1', {
        orientation: gOrientation,
        showNotation: gNotation,
        position: position
    });
};

var freeform = function () {

};

var play = function () {
    var fen = fenNormalize(gBoard1.fen(), 'w', 'KQkq');
    var cfg = makeConfig(fen, new Chess(fen));
    gBoard1 = ChessBoard('board1', cfg);
};

var white = function () {
    gOrientation = 'white';
    gBoard1.orientation(gOrientation);
    gBoard2.orientation(gOrientation);
    gBoard3.orientation(gOrientation);
};

var black = function () {
    gOrientation = 'black';
    gBoard1.orientation(gOrientation);
    gBoard2.orientation(gOrientation);
    gBoard3.orientation(gOrientation);
};

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
};

var single = function () {
    gBoard2.destroy;
    $('#board2').hide();
    gBoard3.destroy;
    $('#board3').hide();
};

var toggleNotation = function () {
    gNotation = !gNotation;
};
