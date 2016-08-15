alias update="time cd /var/www/; git pull; cd frontend; jspm install; gulp bundle; ra"
alias prf="vim ~/.bash_profile; . ~/.bash_profile"
alias ra="sudo /etc/init.d/apache2 restart;"
alias backup="cd ~/backup; mongodump --collection posts --db blog --out ./; git add .;git commit -m 'Daily backup'; git push;"
#Daily backup with 'crontab -e': 0 0 * * * backup
#This type of backup *probably* makes me a bad person, but at this point I don't care