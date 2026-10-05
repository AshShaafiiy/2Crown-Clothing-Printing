#!/bin/bash
expect -c '
set timeout -1
spawn script -q -c "npx firebase-tools init auth" /dev/null
expect "Which providers would you like to enable?"
send " \r"
expect eof
'
