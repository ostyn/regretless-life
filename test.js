db.posts.aggregate(
    [   
        {
            '$match': {
                '$and':[{'location':{'$exists':true}}, {'location':{'$ne':''}}],
                'isDraft':{'$ne':true}
            }
        },
        { 
            '$group': { 
                '_id': {'location':'$location'}, 
                'posts': {
                    '$push':{
                        'title':'$title',
                        'id':'$_id',
                        'date':'$date',
                    }
                } 
            } 
        }
    ]
)