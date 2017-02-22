npm install --dev
while inotifywait -e modify,close_write,move_self -q *.js *.html
do 
  kill `cat .pid`
  sleep 0.1
  node share.js $@ &
  echo $! > .pid
  sleep 3
done
