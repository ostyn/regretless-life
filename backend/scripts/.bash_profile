alias update="cd /var/www/; git pull; cd frontend; npm install; au build --env prod; ra"
alias prf="vim ~/.bash_profile; . ~/.bash_profile"
alias ra="sudo /etc/init.d/apache2 restart;"
alias backup="cd ~/backup; mongodump --collection posts --db blog --out ./; git add .;git commit -m 'Backup'; git push;"
#Daily backup with 'crontab -e': 0 0 * * * backup
#This type of backup *probably* makes me a bad person, but at this point I don't care

#Twice daily cert renewal
#0 0,12 * * * nobody sleep $(( 1$(date +\%N) \% 60 )) ; ~/certbot-auto renew --quiet --no-self-upgrade;