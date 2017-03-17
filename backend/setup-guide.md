Python3/pip3
* pymongo
* flask
* flask-jwt
* flask-cors
* flask-bcrypt
* flask-mail
* flask_compress
* geocoder
* furl
* requests

pip install requests furl flask geocoder pymongo flask-cors flask-jwt flask-bcrypt flask-mail flask_compress

Setting up python with WSGI on Apache
Combination of 
http://www.jakowicz.com/flask-apache-wsgi/

and

useradd -c "user for wsgi flask" -g www-data flask
groupadd www-data

and

https://dykang852.wordpress.com/2014/11/01/how-to-deploy-a-flask-application-on-an-ubuntu-vps/
http://askubuntu.com/questions/569550/assertionerror-using-apache2-and-libapache2-mod-wsgi-py3-on-ubuntu-14-04-python

Used LetsEncrypt and CertBot to setup HTTPS
