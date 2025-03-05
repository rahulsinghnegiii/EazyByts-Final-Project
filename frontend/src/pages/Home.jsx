import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/ui/Button';

export const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Discover Amazing Events
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find and book tickets for the best events in your area. From concerts to conferences,
          we've got you covered.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button as={Link} to="/events" size="lg">
            Browse Events
          </Button>
          <Button as={Link} to="/events/create" variant="outline" size="lg">
            Create Event
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-primary hover:text-primary/90">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Music', 'Sports', 'Technology', 'Arts'].map((category) => (
            <Card key={category} hoverable={true}>
              <Link to={`/events?category=${category.toLowerCase()}`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Explore {category.toLowerCase()} events
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-primary hover:text-primary/90">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id} hoverable={true}>
              <Link to={`/events/${id}`}>
                <img
                  src={`https://source.unsplash.com/random/800x400?event&sig=${id}`}
                  alt="Event"
                  className="h-48 w-full object-cover rounded-t-lg"
                />
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Sample Event {id}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium">From $99</span>
                    <span className="text-sm text-muted-foreground">Mar 15, 2024</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to host your own event?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Create and manage your events with our easy-to-use platform. Reach thousands of potential attendees.
        </p>
        <Button as={Link} to="/events/create" size="lg">
          Get Started
        </Button>
      </section>
    </div>
  );
}; 