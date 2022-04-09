/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2022/04/09 18:26:35
 */

const vsc = require('vscode')
const { join } = require('path')
const { parse } = require('url')
const http = require('http')
const fs = require('iofs')

const std = vsc.window.createOutputChannel('http.server')
const decode = decodeURIComponent

const MIME_TYPES = {
  html: 'text/html;charset=utf-8',
  txt: 'text/plain;charset=utf-8',
  css: 'text/css;charset=utf-8',
  xml: 'text/xml;charset=utf-8',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  tiff: 'image/tiff',
  png: 'image/png',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  bmp: 'image/x-ms-bmp',
  js: 'application/javascript;charset=utf-8',
  json: 'application/json;charset=utf-8',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  m4a: 'audio/x-m4a',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ttf: 'font/font-ttf',
  woff: 'font/font-woff',
  woff2: 'font/font-woff2',
  other: 'application/octet-stream'
}

MIME_TYPES.htm = MIME_TYPES.html
MIME_TYPES.jpeg = MIME_TYPES.jpg
MIME_TYPES.tif = MIME_TYPES.tiff

let root
let enabled = false
let port = 23333
let baseUrl = 'http://127.0.0.1:' + port

std.out = function (...args) {
  std.appendLine('[simple.http]: ' + args.join(' '))
}

function createServer() {
  if (port > 65535) {
    std.out('端口超出有效范围0-65535, 当前为: ' + port)
    enabled = false
    return
  }
  std.out(`尝试使用${port}端口...`)
  http
    .createServer(function (req, res) {
      let pathname = parse(req.url)
        .pathname.slice(1)
        .replace(/[\/]+$/, '')

      pathname = decode(pathname) || 'index.html'

      let file = join(root, pathname)
      let stat = fs.stat(file)
      let ext = pathname.split('.').pop()

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('X-Powered-By', 'VS Code simple.http')

      if (stat.isFile()) {
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Type', MIME_TYPES[ext] || MIME_TYPES.other)
        res.setHeader('Content-Length', stat.size)
        res.writeHead(200, 'OK')
        fs.origin.createReadStream(file).pipe(res)
      } else {
        res.setHeader('Content-Type', MIME_TYPES.html)
        res.setHeader('Content-Length', 0)
        res.writeHead(404, 'Not Found')
        res.end('')
      }
    })
    .listen(port)
    .on('error', err => {
      std.out(`${port}端口被占用~~~`)
      port++
      createServer()
    })
    .on('listening', _ => {
      baseUrl = 'http://127.0.0.1:' + port
      std.out('启动成功, 请访问', baseUrl)
    })
}

function __init__() {
  let folders = vsc.workspace.workspaceFolders

  if (folders && folders.length) {
    root = folders[0].uri.fsPath
  }
  if (root) {
    let file = join(root, '.httpserver')
    //
    if (fs.isfile(file)) {
      let conf = JSON.parse(fs.cat(file).toString())
      if (conf.enabled) {
        enabled = true
        port = conf.port || 23333

        createServer()
      } else {
        std.out('发现配置文件, 但服务为 关闭状态')
      }
    }
  }
}

function deactivate() {}

exports.activate = function (ctx) {
  __init__()

  let cmd = vsc.commands.registerCommand('HttpServer.open', _ => {
    if (enabled) {
      let editor = vsc.window.activeTextEditor
      if (editor) {
        console.log(editor)

        let pathname = editor.document.uri.fsPath.slice(root.length)

        vsc.commands.executeCommand('vscode.open', baseUrl + pathname)
      }
    }
  })
  ctx.subscriptions.push(cmd)
}
exports.deactivate = deactivate
