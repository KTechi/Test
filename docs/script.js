// ================================================== [50]
//     Definition

class Vertex {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
}
class Edge {
  constructor(u, v) {
    this.u = u
    this.v = v
  }
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let VW = window.innerWidth
let VH = window.innerHeight

const vertices = [
                  new Vertex(  0,   0,  10),
                  new Vertex( 10,   0,   0),
                  new Vertex(  0,  10,   0),
                  new Vertex(-10,   0,   0),
                  new Vertex(  0, -10,   0),
                  new Vertex(  0,   0, -10),
  
                  new Vertex(  0,   0,   0),
                 ]
const edges = [
               new Edge(vertices[0], vertices[1]),
               new Edge(vertices[0], vertices[2]),
               new Edge(vertices[0], vertices[3]),
               new Edge(vertices[0], vertices[4]),
               
               new Edge(vertices[1], vertices[2]),
               new Edge(vertices[2], vertices[3]),
               new Edge(vertices[3], vertices[4]),
               new Edge(vertices[4], vertices[1]),
               
               new Edge(vertices[1], vertices[5]),
               new Edge(vertices[2], vertices[5]),
               new Edge(vertices[3], vertices[5]),
               new Edge(vertices[4], vertices[5]),
              ]
const axis = [
              new Edge(vertices[6], vertices[0]),
              new Edge(vertices[6], vertices[1]),
              new Edge(vertices[6], vertices[2]),
             ]

let yaw = 0
let pitch = 0

let q0 = 1
let q1 = 0
let q2 = 0
let q3 = 0

function repaint() {
  context.clearRect(0, 0, VW, VH)
  
  let cosYaw = Math.cos(yaw / 2)
  let sinYaw = Math.sin(yaw / 2)
  let cosPitch = Math.cos(pitch / 2)
  let sinPitch = Math.sin(pitch / 2)
  q0 = cosYaw * cosPitch
  q1 = cosYaw * sinPitch
  q2 = sinYaw * cosPitch
  q3 = sinYaw * sinPitch
  
  // Paint Vertices
//  context.fillStyle = 'rgb(255, 255, 255, 1)'
//  for (let i = 0; i < vertices.length; i++)
//    paintVertex(vertices[i])
  
  // Paint Edges
  context.lineWidth = 4
  context.strokeStyle = 'rgb(255, 255, 255, 1)'
  for (let i = 0; i < edges.length; i++)
    paintEdge(edges[i])
  
  context.strokeStyle = 'rgb(255, 0, 0, 1)'
  paintEdge(axis[0])
  context.strokeStyle = 'rgb(0, 255, 0, 1)'
  paintEdge(axis[1])
  context.strokeStyle = 'rgb(0, 0, 255, 1)'
  paintEdge(axis[2])
}
function paintVertex(vertex) {
  let p1 = 20 * vertex.x
  let p2 = 20 * vertex.y
  let p3 = 20 * vertex.z
  
  let x = p1*(q0**2 + q1**2 - q2**2 - q3**2)
         + 2*p2*(q1*q2 - q3*q0)
         + 2*p3*(q1*q3 + q0*q2)
  let y =  2*p1*(q1*q2 + q3*q0)
         + p2*(q0**2 + q2**2 - q1**2 - q3**2)
         + 2*p3*(q2*q3 - q0*q1)
  
  context.beginPath()
  context.arc(x + VW/2, VH/2 - y, 5, 0, 2 * Math.PI, true)
  context.fill()
}
function paintEdge(edge) {
  let u_p1 = 20 * edge.u.x
  let u_p2 = 20 * edge.u.y
  let u_p3 = 20 * edge.u.z
  let v_p1 = 20 * edge.v.x
  let v_p2 = 20 * edge.v.y
  let v_p3 = 20 * edge.v.z
  
  let u_x = u_p1*(q0**2 + q1**2 - q2**2 - q3**2)
         + 2*u_p2*(q1*q2 - q3*q0)
         + 2*u_p3*(q1*q3 + q0*q2)
  let u_y =  2*u_p1*(q1*q2 + q3*q0)
         + u_p2*(q0**2 + q2**2 - q1**2 - q3**2)
         + 2*u_p3*(q2*q3 - q0*q1)
  let v_x = v_p1*(q0**2 + q1**2 - q2**2 - q3**2)
         + 2*v_p2*(q1*q2 - q3*q0)
         + 2*v_p3*(q1*q3 + q0*q2)
  let v_y =  2*v_p1*(q1*q2 + q3*q0)
         + v_p2*(q0**2 + q2**2 - q1**2 - q3**2)
         + 2*v_p3*(q2*q3 - q0*q1)
  
  context.beginPath()
  context.moveTo(u_x + VW/2, VH/2 - u_y)
  context.lineTo(v_x + VW/2, VH/2 - v_y)
  context.stroke()
}

// ================================================== [50]
//     Window

window.onload = load
window.onresize = resize

function load() {
  resize()
}
function resize() {
  VW = window.innerWidth
  VH = window.innerHeight
  canvas.width  = VW
  canvas.height = VH
  repaint()
}

// ================================================== [50]
//     Mouse Event

canvas.addEventListener('mousemove', mouse_Move, false)

function mouse_Move(event) {
  // Drag
  if (event.buttons === 1) {
    console.log(event.movementX)
    yaw   += event.movementX / 80
    pitch += event.movementY / 80
    
//    if (2*Math.PI < yaw) yaw -= 2*Math.PI
//    else if (yaw < 2*Math.PI) yaw += 2*Math.PI
    yaw %= 2 * Math.PI
    
    if (Math.PI / 2 < pitch) pitch = Math.PI / 2
    else if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
    
    repaint()
  }
}

// ================================================== [50]
//     Touch Listener

let touch
canvas.addEventListener('touchstart' , touch_Start , false)
canvas.addEventListener('touchend'   , touch_End   , false)
canvas.addEventListener('touchcancel', touch_Cancel, false)
canvas.addEventListener('touchmove'  , touch_Move  , false)

function touch_Start (event) {
  touch = event.touches[0]
}
function touch_End   (event) {}
function touch_Cancel(event) {}
function touch_Move  (event) {
  // Disable scroll event
  event.preventDefault()
  
  const t = event.touches[0]
  yaw   += (t.clientX - touch.clientX) / 100
  pitch += (t.clientY - touch.clientY) / 100
  touch = t
  
//  if (2*Math.PI < yaw) yaw -= 2*Math.PI
//  else if (yaw < 2*Math.PI) yaw += 2*Math.PI
  yaw %= 2 * Math.PI
  
  if (Math.PI / 2 < pitch) pitch = Math.PI / 2
  else if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
  
  repaint()
}

// ================================================== [50]
//     Scroll Listener

document.addEventListener('mousewheel', mouse_Wheel, { passive: false })

function mouse_Wheel(event) {
  // Disable scroll event
  event.preventDefault()
  
  yaw   -= event.deltaX / 80
  pitch -= event.deltaY / 80
  
//  if (2*Math.PI < yaw) yaw -= 2*Math.PI
//  else if (yaw < 2*Math.PI) yaw += 2*Math.PI
  yaw %= 2 * Math.PI
  
  if (Math.PI / 2 < pitch) pitch = Math.PI / 2
  else if (pitch < -Math.PI / 2) pitch = -Math.PI / 2
  
  repaint()
}
