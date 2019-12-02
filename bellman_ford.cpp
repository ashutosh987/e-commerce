#include<bits/stdc++.h>
using namespace std;
class edge{
public:
    int U,V,W;
};
class  graph{
public:
    int v,e;
    edge* edg;
    graph(int a,int b){
        v=a+1;
        e=b;
        edg=new edge[e];
    }
};
//relax all the edges v-1 times
bool bellmanFord(graph g,int *dist){
    for(int i=1;i<g.v-1;i++){
            for(int j=0;j<g.e;j++){
                if(dist[g.edg[j].U]!=INT_MAX  &&  dist[g.edg[j].U]+g.edg[j].W<dist[g.edg[j].V])
                        dist[g.edg[j].V]=dist[g.edg[j].U]+g.edg[j].W ;
            }
    }
    // if edges can be relaxed further then there is a cycle
     for(int j=0;j<g.e;j++){
                if(dist[g.edg[j].U]!=INT_MAX  &&  dist[g.edg[j].U]+g.edg[j].W<dist[g.edg[j].V])
                        return false;
            }
            return true;
}

void print(int *dist,int v){
    for(int i=1;i<v;i++){
    cout<<i<<"----"<<dist[i]<<endl;
    }
}

int main(){
    int v,e;
    cin>>v>>e;
    graph  g=graph(v,e);
    for(int i=0;i<e;i++){
        cin>>g.edg[i].U;
        cin>>g.edg[i].V;
        cin>>g.edg[i].W;}
        int *dist=new int[v+1];
        for(int i=0;i<v+1;i++){
        dist[i]=INT_MAX;}
        dist[1]=0;
        if(bellmanFord(g,dist))print(dist,v+1);
return 0;}



