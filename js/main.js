var makeMainBoard = function (_pos, _game) {
    return makeBoard(BOARD1_ID, _pos, _game, gOrientation, gNotation, STATUS_INFO_ID, FEN_INFO_ID, PGN_INFO_ID);
};

var multi = function () {
    gBoard2 = ChessBoard(BOARD2_ID, {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'
    });
    gBoard3 = ChessBoard(BOARD3_ID, {
        orientation: gOrientation,
        showNotation: gNotation,
        position: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1'
    });

    $('#' + BOARD2_ID).show();
    $('#' + BOARD3_ID).show();
};

var single = function () {
    $('#' + BOARD2_ID).hide();
    $('#' + BOARD3_ID).hide();

    if (gBoard2) gBoard2.destroy;
    if (gBoard3) gBoard3.destroy;
};

var orientation = function (event) {
    gOrientation = event.data.orientation;
    [gBoard1, gBoard2, gBoard3].forEach(function (board) {
        if (board) board.orientation(gOrientation);
    }, this);
};

var toggleNotation = function () {
    gNotation = !gNotation;
};

var init = function () {
    gBoard1 = ChessBoard(BOARD1_ID, {
        showNotation: gNotation
    });
};

var start = function () {
    gBoard1 = makeMainBoard('start', new Chess());
};

var fen = function () {
    var ruyLopez = $('#' + FEN_INPUT_ID).val();
    gBoard1 = makeMainBoard(ruyLopez, new Chess(ruyLopez));
};

var pos = function () {
    var position = {
        a4: 'bK',
        c4: 'wK',
        d7: 'wR'
    };
    gBoard1 = ChessBoard(BOARD1_ID, {
        orientation: gOrientation,
        showNotation: gNotation,
        position: position
    });
};

var freeform = function () {
    if (gBoard1) gBoard1.destroy();

    var position = {
        e1: 'wK',
        e8: 'bK'
    };
    gBoard1 = ChessBoard(BOARD1_ID, {
        orientation: gOrientation,
        showNotation: gNotation,
        position: position,
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true
    });
};

var playOrder = function (event) {
    gPlayColor = event.data.playOrder;
};

var play = function () {
    var fen = makeFEN(gBoard1.fen(), gPlayColor, 'KQkq');
    gBoard1 = makeMainBoard(fen, new Chess(fen));
};
