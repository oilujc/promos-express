const graphql = require('graphql')
const Season = require('../models/season')

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLNonNull,
    GraphQLString, 
    GraphQLInt, 
    GraphQLList,
    GraphQLBoolean,
} = graphql

const SeasonType = new GraphQLObjectType({
    name: 'Season',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }, 
        from: { type: GraphQLString },
        upTo: { type: GraphQLString },
        // img: { type: GraphQLObjectType },
        active: { type: GraphQLBoolean }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        season:{
            type: SeasonType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Season.findById(args.id)
            }
        },
        seasons:{
            type: new GraphQLList(SeasonType),
            resolve(parent, args) {
                return Season.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addSeason: {
            type: SeasonType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                from: { type: new GraphQLNonNull(GraphQLString) },
                upTo: { type: new GraphQLNonNull(GraphQLString) },
                // img: { type: GraphQLObjectType },
                active: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parent, args) {
                const season = new Season({
                    name: args.name,
                    from: args.from,
                    upTo: args.upTo,
                    // img: args.img,
                    active: args.active
                });
                return season.save()
            }
        },
        removeSeason: {
            type: SeasonType,
            args: { 
                id: { type: GraphQLID } 
            },
            async resolve(parent, args) {

                await Season.exists({ _id: args.id })
                    .then(exists => {
                        console.log(exists)
                        if (! exists) {
                            throw new Error(`Season ${args.id} doesn't exists`)
                        }
                    })
                    .catch(err => console.log(err))

                return Season.deleteOne({ _id: args.id })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})