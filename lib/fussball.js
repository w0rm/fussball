var Drawer = require('./drawer').Drawer
  , TEAM_COLORS = ['#ff2900', '#42ff00', '#0060ff', '#8f009a']
  , SKIN_COLORS = ['#ffe0da', '#715000', '#fcffb0']
  , BOOTS_COLOR = '#cecece'
  , HANDS = [
      [[0, 0, 1], [-1, 1, 0], [0, 2, 0]]
    , [[0, 0, 1], [-1, 1, 1], [-2, 1, 0], [-3, 0, 0]]
    , [[0, 1, 1], [-1, 2, 1], [-2, 2, 0], [-3, 2, 0]]
    , [[0, 0, 1], [-1, 1, 0], [-2, 2, 0]]
    , [[0, 1, 1], [-1, 2, 0], [-1, 3, 0]]
    , [[0, 0, 1], [-1, -1, 1], [-1, -2, 0], [-1, -3, 0], [-1, -4, 0]]
    ]
  , FEET = [
      [[0, 0, 0], [-1, 1, 0], [-2, 2, 1], [-2, 3, 1]]
    , [[-1, 0, 0], [-1, 1, 0], [-2, 2, 1], [-3, 1, 1]]
    , [[-1, 0, 0], [0, 1, 0], [0, 2, 1], [-1, 2, 1]]
    , [[0, 0, 0], [-1, 0, 0], [-2, 0, 1], [-2, 1, 1]]
    , [[0, 0, 0], [0, 1, 0], [0, 2, 1], [-1, 2, 1]]
    , [[0, 0, 0], [0, 1, 0], [0, 2, 1]]
    ]


module.exports = function (options) {
  var width = parseInt(options.width, 10)
    , height = parseInt(options.height, 10)
    , scale = parseInt(options.scale, 10)
    , drawer = new Drawer( Math.floor(width / scale) + 1
                         , Math.floor(height / scale) + 1)
    , firstClubColors = [ randomElement(TEAM_COLORS)
                        , randomElement(TEAM_COLORS)]
    , secondClubColors = [ randomElement(TEAM_COLORS, firstClubColors[0])
                         , randomElement(TEAM_COLORS, firstClubColors[0])]
    , playersNumber = Math.floor(drawer.width * drawer.height / 4900) * 2
    , i
    , players = []
    , p
    , ball = [0, 0]



  // Draw field
  drawer.eachPoint(function (x, y) {
    return (x + y) % 2 === 0 ? '#78a44f': '#7caf51'
  })

  // Place players (1 to 22)
  playersNumber = Math.max(1, Math.min(playersNumber, 22))
  for (i = 0; i < playersNumber; i++) {
    p = drawer.getRandomPoint(7)
    players.push(p)
    ball[0] += p[0]
    ball[1] += p[1]
  }
  ball[0] = Math.floor(ball[0] / players.length)
  ball[1] = Math.floor(ball[1] / players.length)

  // Sort players by y coordinate
  players.sort(function (a, b) {return a[1] - b[1]})

  // Draw players
  for (i = 0; i < players.length; i++) {
    drawer.draw(
      drawPlayer( players[i][0], players[i][1]
                , (i % 2 === 0) ? firstClubColors: secondClubColors
                )
    )
  }

  // Draw ball
  if (playersNumber > 1) {
    drawer.draw(drawBall(ball[0], ball[1]))
  }

  // Scale image
  return drawer.scale(scale, width, height).toPng()

}


function drawPlayer (x, y, teamColors) {
  return function () {
    var skinColor = randomElement(SKIN_COLORS)
      , shirtOffset = Math.floor(Math.random() * 2)
      , headOffset =  Math.floor(Math.random() * 3) - 1

    // Draw shorts
    this.brick(x - 1, y, 3, 1, teamColors[1])
    this.point(x - 1, y + 1, teamColors[1])
    this.point(x + 1, y + 1, teamColors[1])

    // Draw feet
    this.draw(drawShape( randomElement(FEET)
                       , x - 1, y + 2
                       , [skinColor, BOOTS_COLOR]
                       , false))
    this.draw(drawShape( randomElement(FEET)
                       , x + 1, y + 2
                       , [skinColor, BOOTS_COLOR]
                       , true))

    // Draw shirt base
    this.brick(x - 1 + shirtOffset, y - 3, 2, 3, teamColors[0])

    // Draw head
    this.brick(x - 1 + shirtOffset + headOffset, y - 5, 2, 2, skinColor)

    // Draw hands
    this.draw(drawShape( randomElement(HANDS)
                       , x - 2 + shirtOffset, y - 3
                       , [skinColor, teamColors[0]]
                       , false))
    this.draw(drawShape( randomElement(HANDS)
                       , x + 1 + shirtOffset, y - 3
                       , [skinColor, teamColors[0]]
                       , true))

  }
}


function drawBall (x, y) {
  return function () {
    this.brick(x - 1, y - 1, 3, 3, '#111111')
    this.point(x, y - 1, '#ffffff')
    this.point(x, y + 1, '#ffffff')
    this.point(x - 1, y, '#ffffff')
    this.point(x + 1, y, '#ffffff')
  }
}


function drawShape (shape, x, y, colors, isFlipped) {
  return function () {
    var i, kx = isFlipped ? -1 : 1
    for (i = 0; i < shape.length; i++) {
      this.point(
        x + shape[i][0] * kx
      , y + shape[i][1]
      , colors[shape[i][2]]
      )
    }
  }
}

function randomElement (arr, notThis) {
  // Returns random element from @arr, that is not equal to @notThis
  var res
  while (notThis === (res = arr[Math.floor(Math.random() * arr.length)])) {

  }
  return res
}
