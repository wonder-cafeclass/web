- 다음에 적용할 메터리얼 디자인

https://material.angular.io/components/component/snack-bar

- AngularJS e2e Tester
http://www.protractortest.org/#/

- WebPack
https://angular.io/docs/ts/latest/guide/webpack.html
https://github.com/AngularClass/angular2-webpack-starter

- Angaulr2에서 Jquery를 쓰려면?
- WebPack : Issue - Duplicate identifier 'PropertyKey'
http://blog.mgechev.com/2016/03/28/ambient-type-definitions-duplicate-identifier-typescript-fix/

- Github : .git commit 없이 clone 받기
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/angularclass/angular2-webpack-starter.git

- Apache Server 설정 
$ cat /etc/apache2/httpd.conf
...
<VirtualHost *:80>
# 80으로 접근시, 아래 경로로 바로 접근
# Cafeclass
#DocumentRoot /Library/WebServer/Documents/cafeclass
DocumentRoot /Library/WebServer/Documents
</VirtualHost>
...