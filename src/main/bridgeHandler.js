export default function bridgeHandler(data, types) {
  switch (types[0]) {
    case 'url':
      data.message = location.href;
      break;
    default:
      data.status = 'error';
      data.message = `unknown type: ${types[0]}`;
      break;
  }
  this.postMessage(data);
}
