( function () {
    'use strict';

    let movies = [];
    let goFlag = false

    const renderMovies = function () {
        if ( goFlag === false ) return
        for ( let movie of movies ) {
            if ( !movie.Title ) return
            const $col = $( '<div>' ).addClass( 'col s6' );
            const $card = $( '<div>' ).addClass( 'card hoverable' );
            const $content = $( '<div>' ).addClass( 'card-content center' );
            const $title = $( '<h6>' ).addClass( 'card-title truncate' );

            $title.attr( {
                'data-position': 'top',
                'data-tooltip': movie.Title
            } );

            $title.tooltip( {
                delay: 50
            } ).text( movie.Title );

            const $poster = $( '<img>' ).addClass( 'poster' );

            $poster.attr( {
                src: movie.Poster,
                alt: `${movie.Poster} Poster`
            } );

            $content.append( $title, $poster );
            $card.append( $content );

            const $action = $( '<div>' ).addClass( 'card-action center' );
            const $plot = $( '<a>' );

            $plot.addClass( 'waves-effect waves-light btn modal-trigger' );
            $plot.attr( 'href', `#${movie.imdbID}` );
            $plot.text( 'Plot Synopsis' );

            $action.append( $plot );
            $card.append( $action );

            const $modal = $( '<div>' ).addClass( 'modal' ).attr( 'id', movie.imdbID );
            const $modalContent = $( '<div>' ).addClass( 'modal-content' );
            const $modalHeader = $( '<h4>' ).text( movie.Title );
            const $movieYear = $( '<h6>' ).text( `Released in ${movie.Year}` );
            const $modalText = $( '<p>' ).text( movie.Plot );

            $modalContent.append( $modalHeader, $movieYear, $modalText );
            $modal.append( $modalContent );

            $col.append( $card, $modal );

            $( '#listings' ).append( $col );

            $( '.modal-trigger' ).leanModal();
        }
    };

    // ADD YOUR CODE HERE

    $( '#regularSearch' ).click( function ( e ) {
        e.preventDefault()
        $.get( 'http://www.omdbapi.com/?apikey=702b3bb5&s=' + $( '#search' ).val(), function ( data ) {
            goFlag = true
            for ( let movie in movies ) {
                if ( movies[ movie ].Title === data.Title ) goFlag = false
            }
            if ( goFlag ) {
                movies = []
                $( '#listings' ).empty()
                if ( !data.Search ) {
                    return;
                }
                for ( let i = 0; i < data.Search.length; i++ ) {
                    movies.push( data.Search[ i ] )
                }
                renderMovies()
            }
        } ).fail( function ( err ) {
            goFlag = false
        } )
    } )

    $( '#luckySearch' ).click( function ( e ) {
        e.preventDefault()
        $.get( 'http://www.omdbapi.com/?apikey=702b3bb5&t=' + $( '#search' ).val() + '&plot=full', function ( data ) {
            goFlag = true
            movies = []
            $( '#listings' ).empty()
            movies.push( data )
            renderMovies()
        } ).fail( function ( err ) {
            goFlag = false
        } )
    } )
} )();