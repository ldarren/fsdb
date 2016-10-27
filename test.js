#!/usr/bin/env node

const
DIR_ROOT=		'.root/', // group creator, can add/remove sudo
DIR_SUDO=		'.sudo/', // group admin, can move user out from noob and to oust
DIR_NOOB=		'.noob/',
DIR_OUST=		'.oust/',
DIR_API=		'.api/',
DIR_APP=		'.app/',
DIR_EPI=		'.epi/',
DIR_EPP=		'.epp/',
DIR_GRP=		'.grp/',

GOD=0,
EDEN='jasy',

fsdb=require('.'),
cfg=require('./test.json'),

addRight=function(id,dir,right,cb){
	let grp=db.path(...dir)
	db.create(grp, right, right, TYPE.DIR, MODE.NONE, (err)=>{
		if (err) return cb(err)
		if (!Number.isFinite(id)) return cb()
		id=db.path(id)
		db.createp(db.join(grp,right,id),id,TYPE.LINK, MODE.NONE, cb)
	})
},
cr=function(id,rights,root,url,cb){
	if (!url.length) return cb()
	let u=db.path(...url)
	db.read(db.join(root,u),(err,data,type)=>{
		if (err) return cb(err)
		if (data !== url[url.length-1]) return cb('checking right on wrong path')
		if (TYPE.DIR !== type) return cb('checking right on non group')
		let paths=[]
		for(let i=0,r; r=rights[i]; i++){
			paths.push(db.join(u,r))
		}
		db.findLink(id,root,paths, (err, found)=>{
			if (err || found) return cb(err, found)
			url.pop()
			cr(id,rights,root,url,cb)
		})
	})
},
checkRight=function(id,rights,root,url,cb){
	cr(db.path(id),rights,db.path(...root),url,cb)
},
newGroup=function(dir, cby, cb){
	db.createp(db.path(...dir), dir[dir.length-1], TYPE.DIR, MODE.A_RX, (err)=>{
		if (err) return cb(err)
		addRight(cby, dir, DIR_ROOT, (err)=>{
			if (err) return cb(err)
			addRight(null, dir, DIR_NOOB, cb)
		})
	})
}

let db,TYPE,MODE

fsdb.create(cfg.app,cfg.mods.group,(err,client)=>{
	if (err) return console.error(err)

	db=client
	TYPE=db.TYPE
	MODE=db.MODE

	db.createp(db.path(GOD), GOD, TYPE.DIR, MODE.G_RX, (err)=>{
		if (err) console.error(err)
		newGroup([GOD,EDEN], GOD, (err)=>{
			if (err) return console.error(err)
			checkRight(GOD,[DIR_ROOT,DIR_SUDO],[GOD],[EDEN],(err,found)=>{
				if (err) return console.error(err)
				console.log('Done',found)
			})
		})
	})
})
