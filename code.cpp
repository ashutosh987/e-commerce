#include<bits/stdc++.h>
using namespace std;
int main(){
    int t,n,i,j,k,cnt,res;
    cin>>t;
    while(t--){
                        int vis[10]={0},res=0;
                        cin>>n;
                        string str[n];
                        map<string ,int> m;
                        for(i=0;i<n;i++){
                                 cin>>str[i];
                                 m[str[i]]++;
                                 vis[str[i][3] - '0']++;
                        }
                        for(i=0;i<n;i++){
                            if(m[str[i]]>1){
                                  res++;
                                  m[str[i]]--;vis[str[i][3] - '0']--;
                                  for(j=0;j<=9;j++) {
                                        if(!vis[j]){
                                            str[i][3]=(j+'0');
                                            vis[j]++;
                                            break;
                                        }
                                  }
                            }
                        }
                        cout<<res<<endl;
                        for(i=0;i<n;i++){
                        cout<<str[i]<<endl;
                        }
    }

}
