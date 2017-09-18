var makeFEN = function (_pos, _active, _castling) {
    return _pos + ' ' + _active + ' ' + _castling + ' - 0 1';
};

var makeBoard = function (_boardId, _pos, _game, _orientation, _notation, _statusId, _fenId, _pgnId) {
    var board = null;

    var statusEl = $('#' + _statusId),
        fenEl = $('#' + _fenId),
        pgnEl = $('#' + _pgnId);

    var removeGreySquares = function () {
        $('#' + _boardId + ' .square-55d63').css('background', '');
    };

    var greySquare = function (square) {
        var squareEl = $('#' + _boardId + ' .square-' + square);

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
        board.position(_game.fen());
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
        orientation: _orientation,
        showNotation: _notation,
        position: _pos,
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };

    board = ChessBoard(_boardId, config);
    updateStatus();

    return board;
};
