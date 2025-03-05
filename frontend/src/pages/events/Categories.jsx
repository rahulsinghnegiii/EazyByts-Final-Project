import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import eventsService from '../../services/events.service';

const categoryIcons = {
  music: '🎵',
  sports: '⚽',
  arts: '🎨',
  food: '🍽️',
  business: '💼',
  technology: '💻',
  education: '📚',
  lifestyle: '🌟',
  health: '🏥',
  other: '📌',
};

export const Categories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => eventsService.getCategories(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Event Categories</h1>
        <p className="text-muted-foreground">
          Browse events by category
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/events?category=${category.id}`}
            className="block group"
          >
            <Card hoverable={true}>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-2xl">
                    {categoryIcons[category.slug] || '📌'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.eventCount} events
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium">No categories found</h3>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 