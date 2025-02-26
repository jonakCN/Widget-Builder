import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
	Text,
	Image as ImageIcon,
	Square,
	ChevronDown,
	LayoutGrid,
	X,
	Trash2,
	Save,
	GripVertical,
	Layout,
	CreditCard,
	Table as TableIcon,
	Plus,
	Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const availableWidgets = [
	// Basic Widgets
	{
		type: 'Text',
		content: 'This is a new text block. Change the text.',
		style: {
			fontSize: '16px',
			fontWeight: 'normal',
			fontFamily: 'Arial',
			textAlign: 'left',
			color: '#000000',
			lineHeight: '1.5',
			letterSpacing: '0px',
			padding: '16px',
		},
		category: 'Basic',
		icon: <Text className='w-6 h-6' />,
		description: 'Add text block',
		color: 'bg-blue-50',
	},
	{
		type: 'Image',
		content: '',
		category: 'Basic',
		icon: <ImageIcon className='w-6 h-6' />,
		description: 'Add image',
		color: 'bg-purple-50',
	},
	{
		type: 'Button',
		content: 'Click Me',
		style: {
			backgroundColor: '#3B82F6',
			textColor: '#FFFFFF',
			borderRadius: '6px',
			width: 'auto',
			actionUrl: '',
			alertMessage: 'Button clicked!',
		},
		category: 'Basic',
		icon: <Square className='w-6 h-6' />,
		description: 'Add button',
		color: 'bg-green-50',
	},
	{
		type: 'Card',
		content: {
			title: 'Welcome to My Card',
			description:
				'This is a sample card description. You can edit both the title and description to create your own custom card content.',
		},
		category: 'Basic',
		icon: <CreditCard className='w-6 h-6' />,
		description: 'Add card',
		color: 'bg-yellow-50',
	},
	{
		type: 'Table',
		content: {
			rows: 3,
			columns: 3,
			data: Array(3)
				.fill()
				.map(() => Array(3).fill('Cell')), // Default 3x3 table
		},
		category: 'Basic',
		icon: <TableIcon className='w-6 h-6' />,
		description: 'Add table',
		color: 'bg-purple-50',
	},
];

const useWindowSize = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setSize({ width: window.innerWidth, height: window.innerHeight });
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
};

const Header = ({
	isDropdownOpen,
	setIsDropdownOpen,
	savedLayouts,
	loadLayout,
	selectedLayout,
}) => {
	return (
		<div className='bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-700 shadow-lg sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16 relative'>
					{/* Left side */}
					<div className='flex items-center space-x-3 w-1/3'>
						<div className='flex items-center justify-center w-10 h-10 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm'>
							<LayoutGrid size={24} className='text-white' />
						</div>
						<h1 className='text-2xl font-bold text-white tracking-tight'>
							Widget Builder
						</h1>
					</div>

					{/* Center - Selected Layout Name */}
					<div className='flex-1 flex justify-center w-1/3'>
						<AnimatePresence mode='wait'>
							{selectedLayout && (
								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
									className='flex items-center'>
									<div className='flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full'>
										<Layout size={18} className='text-white/80' />
										<span className='text-base font-medium text-white'>
											{selectedLayout.name}
										</span>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Right side */}
					<div className='relative w-1/3 flex justify-end'>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-md hover:bg-white/20'>
							Load Layout
							<motion.div
								animate={{ rotate: isDropdownOpen ? 180 : 0 }}
								transition={{ duration: 0.2 }}>
								<ChevronDown size={16} />
							</motion.div>
						</motion.button>
						<AnimatePresence>
							{isDropdownOpen && (
								<>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										className='fixed inset-0 z-40'
										onClick={() => setIsDropdownOpen(false)}
									/>
									<motion.div
										initial={{ opacity: 0, y: -10, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -10, scale: 0.95 }}
										transition={{
											duration: 0.2,
											ease: [0.4, 0, 0.2, 1],
										}}
										className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden'>
										{savedLayouts.length === 0 ? (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className='px-4 py-3 text-sm text-gray-500'>
												No saved layouts
											</motion.div>
										) : (
											<motion.div className='py-1 max-h-[400px] overflow-y-auto'>
												{savedLayouts.map((savedLayout, index) => (
													<motion.button
														key={savedLayout.id}
														initial={{ opacity: 0, x: -10 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{
															delay: index * 0.05,
															duration: 0.2,
														}}
														whileHover={{
															backgroundColor: '#F3F4F6',
															x: 4,
														}}
														onClick={() => {
															loadLayout(savedLayout);
															setIsDropdownOpen(false);
														}}
														className='w-full text-left px-4 py-2 text-sm text-gray-700'>
														{savedLayout.name}
													</motion.button>
												))}
											</motion.div>
										)}
									</motion.div>
								</>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
};

const columnLayouts = [
	{ type: 'Column-100', layout: '100', label: '100%', icon: '■' },
	{ type: 'Column-50-50', layout: '50-50', label: '50/50', icon: '■ ■' },
	{ type: 'Column-70-30', layout: '70-30', label: '70/30', icon: '■■ ■' },
	{ type: 'Column-30-70', layout: '30-70', label: '30/70', icon: '■ ■■' },
	{
		type: 'Column-33-33-33',
		layout: '33-33-33',
		label: '33/33/33',
		icon: '■ ■ ■',
	},
];

const ColumnSelectionPopup = ({ position, onSelect, onClose }) => {
	return (
		<div
			className='absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50'
			style={{ top: position.y, left: position.x }}>
			<div className='grid grid-cols-2 gap-3'>
				{columnLayouts.map((option) => (
					<button
						key={option.layout}
						onClick={() => onSelect(option)}
						className='flex flex-col items-center p-3 rounded-lg hover:bg-gray-50'>
						<div className='flex gap-1 mb-2'>
							{option.layout.split('-').map((width, i) => (
								<div key={i} className='w-6 h-12 bg-gray-100 rounded' />
							))}
						</div>
						<span className='text-sm font-medium text-gray-600'>
							{option.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};

const WidgetPanel = ({ onDragStart, isCollapsed }) => {
	const [showColumnPopup, setShowColumnPopup] = useState(false);
	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

	const handleColumnClick = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setPopupPosition({
			x: rect.right + 10,
			y: rect.top,
		});
		setShowColumnPopup(true);
	};

	const handleColumnSelect = (layout) => {
		const columnWidget = {
			type: layout.type,
			content: {
				layout: layout.layout,
				columns: layout.layout.split('-').map(() => []),
				columnWidths: layout.layout.split('-').map((width) => ({
					width: Math.floor((parseInt(width) / 100) * 12),
				})),
			},
		};
		onDragStart(null, columnWidget);
		setShowColumnPopup(false);
	};

	return (
		<div
			className={`bg-white border-r border-gray-200 transition-all duration-300 ${
				isCollapsed ? 'w-12' : 'w-80'
			}`}>
			<div className='p-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-800'>Elements</h2>
			</div>
			<div className='p-4'>
				{/* Layout Section */}
				<div className='mb-8'>
					<h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>
						Layout
					</h3>
					<div
						className='p-4 bg-yellow-50 rounded-lg cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 transition-all'
						onClick={handleColumnClick}>
						<div className='flex flex-col items-center'>
							<Layout className='w-6 h-6 text-gray-700 mb-2' />
							<span className='text-sm font-medium text-gray-700'>Columns</span>
							<span className='text-xs text-gray-500 mt-1'>
								Add column layout
							</span>
						</div>
					</div>
				</div>

				{/* Content Section */}
				<div className='mb-8'>
					<h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>
						Content
					</h3>
					<div className='grid grid-cols-2 gap-3'>
						{availableWidgets.map((widget, index) => (
							<div
								key={index}
								draggable
								onDragStart={(e) => {
									e.target.classList.add('opacity-50', 'scale-95', 'rotate-2');
									onDragStart(e, widget);
								}}
								onDragEnd={(e) => {
									e.target.classList.remove(
										'opacity-50',
										'scale-95',
										'rotate-2'
									);
								}}
								className={`flex flex-col items-center justify-center p-4 
									${widget.color} rounded-lg cursor-move
									hover:shadow-md hover:scale-105 active:scale-95 
									transition-all duration-200 transform`}>
								<div className='text-gray-700 mb-2'>{widget.icon}</div>
								<span className='text-sm font-medium text-gray-700'>
									{widget.type}
								</span>
								<span className='text-xs text-gray-500 mt-1 text-center'>
									{widget.description}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
			{showColumnPopup && (
				<>
					<div
						className='fixed inset-0 z-40'
						onClick={() => setShowColumnPopup(false)}
					/>
					<ColumnSelectionPopup
						position={popupPosition}
						onSelect={handleColumnSelect}
						onClose={() => setShowColumnPopup(false)}
					/>
				</>
			)}
		</div>
	);
};

const Canvas = ({
	layout,
	widgets,
	onLayoutChange,
	onDrop,
	setWidgets,
	setLayout,
	updateWidget,
}) => {
	const { width } = useWindowSize();
	const canvasWidth = Math.min(width - (width < 640 ? 48 : 256) - 64, 1024);
	const [selectedWidget, setSelectedWidget] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const handleAddRow = (columnOption) => {
		const newRow = {
			type: columnOption.type,
			i: new Date().getTime().toString(),
			x: 0,
			y: layout.length,
			w: 12,
			h: 4,
			content: {
				layout: columnOption.layout,
				columns:
					columnOption.type === 'Column-1'
						? [[]]
						: columnOption.type === 'Column-2'
						? [[], []]
						: [[], [], []],
				columnWidths:
					columnOption.type === 'Column-1'
						? [{ width: 12 }]
						: columnOption.type === 'Column-2'
						? [{ width: 6 }, { width: 6 }]
						: [{ width: 4 }, { width: 4 }, { width: 4 }],
			},
		};

		setLayout([...layout, newRow]);
		setWidgets([...widgets, newRow]);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const hasColumnWidgets = () => {
		return widgets.some((widget) => widget.type.startsWith('Column'));
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const droppedWidget = JSON.parse(e.dataTransfer.getData('widget'));

		// For column widgets
		if (droppedWidget.type.startsWith('Column')) {
			// Check if it's an existing widget (has an id)
			if (droppedWidget.i) {
				// Reorder existing column widget
				const draggedIndex = widgets.findIndex((w) => w.i === droppedWidget.i);
				const dropIndex = widgets.length; // Default to end if not over another widget

				if (draggedIndex !== -1) {
					const newWidgets = [...widgets];
					const [removed] = newWidgets.splice(draggedIndex, 1);
					newWidgets.splice(dropIndex, 0, removed);

					// Update layout positions
					const newLayout = newWidgets.map((widget, index) => ({
						...widget,
						y: index,
					}));

					setWidgets(newWidgets);
					setLayout(newLayout);
					return;
				}
			} else {
				// Add new column widget
				const newWidget = {
					...droppedWidget,
					i: new Date().getTime().toString(),
					x: 0,
					y: layout.length,
					w: 12,
					h: 4,
				};
				setLayout([...layout, newWidget]);
				setWidgets([...widgets, newWidget]);
				return;
			}
		}

		// For non-column widgets
		alert('Please drop widgets inside a column.');
		return;
	};

	const renderWidget = (widget, updateWidget) => {
		if (widget.type.startsWith('Column')) {
			return (
				<motion.div
					className='relative group cursor-move w-full bg-white rounded-lg'
					draggable
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					whileDrag={{ scale: 1.02, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
					transition={{ duration: 0.2 }}
					onDragStart={(e) => {
						e.stopPropagation();
						e.dataTransfer.setData(
							'widget',
							JSON.stringify({
								...widget,
								i: widget.i,
							})
						);
					}}>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setWidgets((widgets) => widgets.filter((w) => w.i !== widget.i));
							setLayout((layout) => layout.filter((l) => l.i !== widget.i));
							setIsDrawerOpen(false);
							setSelectedWidget(null);
						}}
						className='absolute -top-2 -right-2 z-50 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all'>
						<X size={14} />
					</button>
					<div className='absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-lg pointer-events-none' />
					<div className='drag-handle absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-move p-1 hover:bg-gray-100 rounded'>
						<GripVertical size={16} className='text-gray-500' />
					</div>
					<div className='flex gap-4 p-4'>
						{widget.content.columns.map((columnWidgets, index) => {
							const widths = widget.content.layout.split('-');
							const width = parseInt(widths[index]);

							return (
								<div
									key={index}
									className='min-h-[100px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'
									style={{
										width: `${width}%`,
										flex: 'none',
									}}
									onClick={(e) => e.stopPropagation()}
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.currentTarget.classList.add('bg-blue-50');
									}}
									onDragLeave={(e) => {
										e.preventDefault();
										e.currentTarget.classList.remove('bg-blue-50');
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.currentTarget.classList.remove('bg-blue-50');

										const droppedWidget = JSON.parse(
											e.dataTransfer.getData('widget')
										);

										// Prevent dropping columns inside columns
										if (droppedWidget.type.startsWith('Column')) {
											alert('Columns cannot be dropped inside other columns.');
											return;
										}

										const newWidget = {
											...droppedWidget,
											i: new Date().getTime().toString(),
											style: droppedWidget.style || {
												fontSize: '16px',
												fontWeight: 'normal',
												fontFamily: 'Arial',
												textAlign: 'left',
												color: '#000000',
												lineHeight: '1.5',
												letterSpacing: '0px',
												padding: '16px',
											},
										};

										const updatedColumns = [...widget.content.columns];
										updatedColumns[index] = [
											...(columnWidgets || []),
											newWidget,
										];

										setWidgets(
											widgets.map((w) =>
												w.i === widget.i
													? {
															...w,
															content: {
																...w.content,
																columns: updatedColumns,
															},
													  }
													: w
											)
										);
									}}>
									<div className='space-y-4 p-4'>
										{columnWidgets &&
											columnWidgets.map((columnWidget) => (
												<div
													key={columnWidget.i}
													className='relative group/item bg-white rounded-lg shadow-sm'
													onClick={(e) => {
														e.stopPropagation();
														setSelectedWidget(columnWidget);
														setIsDrawerOpen(true);
													}}>
													<div className='absolute inset-0 border-2 border-transparent group-hover/item:border-red-500 rounded-lg pointer-events-none' />
													{renderWidget(columnWidget, updateWidget)}
												</div>
											))}
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>
			);
		}
		if (widget.type === 'Text') {
			return (
				<motion.div
					layout
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					whileDrag={{ scale: 1.05, zIndex: 1 }}
					transition={{ duration: 0.2 }}
					className='relative group cursor-pointer'
					onClick={(e) => {
						e.stopPropagation();
						setSelectedWidget(widget);
						setIsDrawerOpen(true);
					}}>
					<div className='absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-lg pointer-events-none' />
					<div className='p-4'>
						{widget.content || 'This is a new text block. Change the text.'}
					</div>
				</motion.div>
			);
		}
		if (widget.type === 'Image') {
			return (
				<motion.div
					layout
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					whileDrag={{ scale: 1.05, zIndex: 1 }}
					transition={{ duration: 0.2 }}
					className='relative group cursor-pointer'
					style={{
						textAlign: widget.style?.textAlign || 'center',
						width: '100%',
					}}
					onClick={(e) => {
						e.stopPropagation();
						setSelectedWidget(widget);
						setIsDrawerOpen(true);
					}}>
					<div className='absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-lg pointer-events-none' />
					{widget.content ? (
						<motion.img
							src={widget.content}
							alt='Widget'
							style={{
								width: widget.style?.width || '100%',
								margin: '0 auto',
							}}
							className='rounded-lg'
							whileHover={{ scale: 1.01 }}
						/>
					) : (
						<div className='p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center'>
							<ImageIcon className='w-8 h-8 text-gray-400 mx-auto mb-2' />
							<p className='text-sm text-gray-500'>Click to add image</p>
						</div>
					)}
				</motion.div>
			);
		}
		if (widget.type === 'Button') {
			const handleClick = (e) => {
				e.stopPropagation();
				if (widget.style.actionUrl) {
					window.open(widget.style.actionUrl, '_blank');
				} else if (widget.style.alertMessage) {
					alert(widget.style.alertMessage);
				}
			};

			return (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleClick}
					style={{
						backgroundColor: widget.style.backgroundColor,
						color: widget.style.textColor,
						borderRadius: widget.style.borderRadius,
						width: widget.style.width === 'auto' ? 'auto' : '100%',
						padding: '8px 16px',
					}}
					className='hover:opacity-90 transition-opacity'>
					{widget.content}
				</motion.button>
			);
		}
		if (widget.type === 'Card') {
			return (
				<motion.div
					layout
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					whileDrag={{ scale: 1.05, zIndex: 1 }}
					transition={{ duration: 0.2 }}
					className='w-full p-4 bg-white rounded-lg shadow-md'
					whileHover={{ scale: 1.01, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
					<h2 className='text-xl font-semibold mb-2'>{widget.content.title}</h2>
					<p className='text-gray-600'>{widget.content.description}</p>
				</motion.div>
			);
		}
		if (widget.type === 'Table') {
			return (
				<motion.div
					layout
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					whileDrag={{ scale: 1.05, zIndex: 1 }}
					transition={{ duration: 0.2 }}
					className='w-full overflow-x-auto'
					whileHover={{ scale: 1.01 }}
					onClick={(e) => {
						e.stopPropagation();
						setSelectedWidget(widget);
						setIsDrawerOpen(true);
					}}>
					<table className='min-w-full border-collapse'>
						<tbody>
							{widget.content.data.map((row, rowIndex) => (
								<tr key={rowIndex}>
									{row.map((cell, colIndex) => (
										<td
											key={colIndex}
											className='border border-gray-300 p-2 min-w-[100px]'>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</motion.div>
			);
		}
		return null;
	};

	return (
		<div
			className='flex-1 bg-gray-100 overflow-x-hidden'
			onDragOver={handleDragOver}
			onDrop={handleDrop}>
			<div className='max-w-4xl mx-auto p-8'>
				<div className='bg-white rounded-lg shadow-sm min-h-[calc(100vh-8rem)]'>
					{widgets.length === 0 ? (
						<EmptyCanvas onAddRow={handleAddRow} />
					) : (
						<div className='p-4 space-y-4'>
							<AnimatePresence>
								{widgets.map((widget, index) => (
									<motion.div
										key={widget.i}
										layout
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{ duration: 0.2 }}
										className='mb-4'
										onDragOver={(e) => {
											e.preventDefault();
											e.currentTarget.classList.add('bg-blue-50');
										}}
										onDragLeave={(e) => {
											e.preventDefault();
											e.currentTarget.classList.remove('bg-blue-50');
										}}
										onDrop={(e) => {
											e.currentTarget.classList.remove('bg-blue-50');
											handleDrop(e);
										}}>
										{renderWidget(widget, updateWidget)}
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					)}
				</div>
			</div>
			<SideDrawer
				isOpen={isDrawerOpen}
				onClose={() => {
					setIsDrawerOpen(false);
					setSelectedWidget(null);
				}}
				selectedWidget={selectedWidget}
				updateWidget={setWidgets}
				onDelete={(widgetId) => {
					setWidgets(
						widgets
							.map((w) => {
								if (w.type.startsWith('Column')) {
									return {
										...w,
										content: {
											...w.content,
											columns: w.content.columns.map((column) =>
												column.filter((cw) => cw.i !== widgetId)
											),
										},
									};
								}
								return w;
							})
							.filter((w) => w.i !== widgetId)
					);
					setLayout(layout.filter((l) => l.i !== widgetId));
					setIsDrawerOpen(false);
					setSelectedWidget(null);
				}}
			/>
		</div>
	);
};

const TextControls = ({ widget, updateWidget, setError }) => {
	const [text, setText] = useState(widget.content);
	const [style, setStyle] = useState(
		widget.style || {
			fontSize: '16px',
			fontWeight: 'normal',
			fontFamily: 'Arial',
			textAlign: 'left',
			color: '#000000',
			lineHeight: '1.5',
			letterSpacing: '0px',
			padding: '16px',
		}
	);

	const handleTextChange = (value) => {
		setText(value);
		setError(value.trim() === '' ? 'Text content cannot be empty' : '');
		updateWidget({
			...widget,
			content: value,
			style: style,
		});
	};

	const handleStyleChange = (property, value) => {
		const newStyle = { ...style, [property]: value };
		setStyle(newStyle);
		updateWidget({
			...widget,
			content: text,
			style: newStyle,
		});
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Text Content
				</label>
				<textarea
					value={text}
					onChange={(e) => handleTextChange(e.target.value)}
					className={`w-full p-2 border rounded-lg min-h-[100px] ${
						text.trim() === '' ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder='Enter text content...'
				/>
				{text.trim() === '' && (
					<p className='mt-1 text-sm text-red-500'>
						Text content cannot be empty
					</p>
				)}
			</div>

			<div className='space-y-4'>
				<h3 className='font-medium text-gray-800'>Typography</h3>

				<div>
					<label className='block text-sm text-gray-600 mb-1'>
						Font Family
					</label>
					<select
						value={style.fontFamily}
						onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
						className='w-full p-2 border rounded-lg'>
						{['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Inter'].map(
							(font) => (
								<option key={font} value={font}>
									{font}
								</option>
							)
						)}
					</select>
				</div>

				<div>
					<label className='block text-sm text-gray-600 mb-1'>Font Size</label>
					<select
						value={style.fontSize}
						onChange={(e) => handleStyleChange('fontSize', e.target.value)}
						className='w-full p-2 border rounded-lg'>
						{[
							'12px',
							'14px',
							'16px',
							'18px',
							'20px',
							'24px',
							'28px',
							'32px',
						].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block text-sm text-gray-600 mb-2'>Alignment</label>
					<div className='flex gap-2'>
						{['left', 'center', 'right', 'justify'].map((align) => (
							<button
								key={align}
								onClick={() => handleStyleChange('textAlign', align)}
								className={`p-2 rounded-lg flex-1 ${
									style.textAlign === align
										? 'bg-blue-500 text-white'
										: 'bg-gray-100'
								}`}>
								{align.charAt(0).toUpperCase() + align.slice(1)}
							</button>
						))}
					</div>
				</div>

				<div>
					<label className='block text-sm text-gray-600 mb-2'>Style</label>
					<div className='flex gap-2'>
						<button
							onClick={() =>
								handleStyleChange(
									'fontWeight',
									style.fontWeight === 'bold' ? 'normal' : 'bold'
								)
							}
							className={`p-2 rounded-lg flex-1 ${
								style.fontWeight === 'bold'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100'
							}`}>
							Bold
						</button>
						<button
							onClick={() =>
								handleStyleChange(
									'fontStyle',
									style.fontStyle === 'italic' ? 'normal' : 'italic'
								)
							}
							className={`p-2 rounded-lg flex-1 ${
								style.fontStyle === 'italic'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100'
							}`}>
							Italic
						</button>
						<button
							onClick={() =>
								handleStyleChange(
									'textDecoration',
									style.textDecoration === 'underline' ? 'none' : 'underline'
								)
							}
							className={`p-2 rounded-lg flex-1 ${
								style.textDecoration === 'underline'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100'
							}`}>
							Underline
						</button>
					</div>
				</div>

				<div>
					<label className='block text-sm text-gray-600 mb-1'>Text Color</label>
					<input
						type='color'
						value={style.color}
						onChange={(e) => handleStyleChange('color', e.target.value)}
						className='w-full h-10 rounded-lg'
					/>
				</div>
			</div>
		</div>
	);
};

const ColumnControls = ({ widget, updateWidget }) => {
	const columnLayouts = [
		{ type: 'Column-1', layout: '100', label: 'Full Width' },
		{ type: 'Column-2', layout: '50-50', label: 'Two Equal Columns' },
		{ type: 'Column-3', layout: '33-33-33', label: 'Three Equal Columns' },
		{ type: 'Column-2-uneven', layout: '70-30', label: 'Two Columns (70:30)' },
		{ type: 'Column-2-uneven', layout: '30-70', label: 'Two Columns (30:70)' },
	];

	const handleColumnChange = (layout) => {
		const newColumns = layout.layout.split('-').map(() => []);
		const newColumnWidths = layout.layout.split('-').map((width) => ({
			width: Math.floor((parseInt(width) / 100) * 12),
		}));

		// Preserve existing content where possible
		widget.content.columns.forEach((col, idx) => {
			if (idx < newColumns.length) {
				newColumns[idx] = col;
			}
		});

		updateWidget({
			...widget,
			type: layout.type,
			content: {
				layout: layout.layout,
				columns: newColumns,
				columnWidths: newColumnWidths,
			},
		});
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='font-medium text-gray-800 mb-4'>Column Layout</h3>
				<div className='grid grid-cols-1 gap-3'>
					{columnLayouts.map((layout) => (
						<button
							key={layout.layout}
							onClick={() => handleColumnChange(layout)}
							className={`w-full p-3 border-2 rounded-lg transition-all ${
								widget.content.layout === layout.layout
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 hover:border-blue-300'
							}`}>
							<div className='flex gap-1 mb-2'>
								{layout.layout.split('-').map((width, i) => (
									<div
										key={i}
										className='h-10 bg-gray-200 rounded'
										style={{ width: `${width}%` }}
									/>
								))}
							</div>
							<div className='flex justify-between items-center mt-2'>
								<span className='text-sm font-medium text-gray-700'>
									{layout.label}
								</span>
								<span className='text-xs text-gray-500'>
									{layout.layout.split('-').join(':')}
								</span>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

const ImageControls = ({ widget, updateWidget }) => {
	const [imageUrl, setImageUrl] = useState(widget.content || '');
	const [alignment, setAlignment] = useState(
		widget.style?.textAlign || 'center'
	);
	const [width, setWidth] = useState(widget.style?.width || '100%');
	const [urlInput, setUrlInput] = useState('');
	const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const newUrl = reader.result;
				setImageUrl(newUrl);
				updateWidget({
					...widget,
					content: newUrl,
					style: {
						...widget.style,
						width,
						textAlign: alignment,
					},
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUrlSubmit = (e) => {
		e.preventDefault();
		if (urlInput.trim()) {
			setImageUrl(urlInput);
			updateWidget({
				...widget,
				content: urlInput,
				style: {
					...widget.style,
					width,
					textAlign: alignment,
				},
			});
		}
	};

	const handleAlignmentChange = (newAlignment) => {
		setAlignment(newAlignment);
		updateWidget({
			...widget,
			content: imageUrl,
			style: {
				...widget.style,
				width,
				textAlign: newAlignment,
			},
		});
	};

	const handleWidthChange = (newWidth) => {
		setWidth(newWidth);
		updateWidget({
			...widget,
			content: imageUrl,
			style: {
				...widget.style,
				width: newWidth,
				textAlign: alignment,
			},
		});
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='font-medium text-gray-800 mb-4'>Image</h3>
				<div className='space-y-4'>
					{/* Tab Buttons */}
					<div className='flex rounded-lg border border-gray-200 p-1 mb-4'>
						<button
							onClick={() => setActiveTab('upload')}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
								${
									activeTab === 'upload'
										? 'bg-blue-500 text-white'
										: 'text-gray-500 hover:text-gray-700'
								}`}>
							Upload
						</button>
						<button
							onClick={() => setActiveTab('url')}
							className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
								${
									activeTab === 'url'
										? 'bg-blue-500 text-white'
										: 'text-gray-500 hover:text-gray-700'
								}`}>
							URL
						</button>
					</div>

					{/* Image Preview */}
					{imageUrl ? (
						<div className='relative group'>
							<img
								src={imageUrl}
								alt='Uploaded'
								className='w-full rounded-lg border border-gray-200'
							/>
							<button
								onClick={() => {
									setImageUrl('');
									setUrlInput('');
									updateWidget({
										...widget,
										content: '',
										style: {
											...widget.style,
											width,
											textAlign: alignment,
										},
									});
								}}
								className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
								<X size={16} />
							</button>
						</div>
					) : (
						<>
							{activeTab === 'upload' ? (
								<div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
									<input
										type='file'
										accept='image/*'
										onChange={handleImageUpload}
										className='hidden'
										id='image-upload'
									/>
									<label
										htmlFor='image-upload'
										className='cursor-pointer flex flex-col items-center'>
										<ImageIcon className='w-12 h-12 text-gray-400 mb-4' />
										<span className='text-sm font-medium text-gray-700'>
											Click to upload image
										</span>
										<span className='text-xs text-gray-500 mt-1'>
											PNG, JPG, GIF up to 10MB
										</span>
									</label>
								</div>
							) : (
								<form onSubmit={handleUrlSubmit} className='space-y-3'>
									<div>
										<label className='block text-sm text-gray-600 mb-2'>
											Image URL
										</label>
										<input
											type='url'
											value={urlInput}
											onChange={(e) => setUrlInput(e.target.value)}
											placeholder='https://example.com/image.jpg'
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										/>
									</div>
									<button
										type='submit'
										className='w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
										Add Image
									</button>
								</form>
							)}
						</>
					)}

					{/* Existing alignment and width controls */}
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Alignment
						</label>
						<div className='flex gap-2'>
							{['left', 'center', 'right'].map((align) => (
								<button
									key={align}
									onClick={() => handleAlignmentChange(align)}
									className={`p-2 rounded-lg flex-1 ${
										alignment === align
											? 'bg-blue-500 text-white'
											: 'bg-gray-100'
									}`}>
									{align.charAt(0).toUpperCase() + align.slice(1)}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className='block text-sm text-gray-600 mb-2'>Width</label>
						<div className='flex gap-2'>
							{['25%', '50%', '75%', '100%'].map((size) => (
								<button
									key={size}
									onClick={() => handleWidthChange(size)}
									className={`p-2 rounded-lg flex-1 ${
										width === size ? 'bg-blue-500 text-white' : 'bg-gray-100'
									}`}>
									{size}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ButtonControls = ({ widget, updateWidget }) => {
	const [style, setStyle] = useState(widget.style);
	const [content, setContent] = useState(widget.content);

	const handleStyleChange = (key, value) => {
		const newStyle = { ...style, [key]: value };
		setStyle(newStyle);
		updateWidget({
			...widget,
			style: newStyle,
		});
	};

	const handleContentChange = (value) => {
		setContent(value);
		updateWidget({
			...widget,
			content: value,
		});
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='font-medium text-gray-800 mb-4'>Button Properties</h3>
				<div className='space-y-4'>
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Button Text
						</label>
						<input
							type='text'
							value={content}
							onChange={(e) => handleContentChange(e.target.value)}
							className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Action URL
						</label>
						<input
							type='url'
							value={style.actionUrl}
							onChange={(e) => handleStyleChange('actionUrl', e.target.value)}
							placeholder='https://example.com'
							className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						<p className='text-xs text-gray-500 mt-1'>
							Leave empty to use alert message instead
						</p>
					</div>
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Alert Message
						</label>
						<input
							type='text'
							value={style.alertMessage}
							onChange={(e) =>
								handleStyleChange('alertMessage', e.target.value)
							}
							placeholder='Enter alert message'
							className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						<p className='text-xs text-gray-500 mt-1'>
							Used when no URL is provided
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const CardControls = ({ widget, updateWidget }) => {
	const [error, setError] = useState('');
	const [content, setContent] = useState(
		widget?.content || {
			title: 'Welcome to My Card',
			description:
				'This is a sample card description. You can edit both the title and description to create your own custom card content.',
		}
	);

	const handleContentChange = (key, value) => {
		const newContent = { ...content, [key]: value };
		setContent(newContent);

		// Validate both fields
		if (!newContent.title.trim() && !newContent.description.trim()) {
			setError('Title and description cannot be empty');
		} else if (!newContent.title.trim()) {
			setError('Title cannot be empty');
		} else if (!newContent.description.trim()) {
			setError('Description cannot be empty');
		} else {
			setError('');
		}

		updateWidget({
			...widget,
			content: newContent,
		});
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='font-medium text-gray-800 mb-4'>Card Properties</h3>
				<div className='space-y-4'>
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Card Title *
						</label>
						<input
							type='text'
							value={content.title}
							onChange={(e) => handleContentChange('title', e.target.value)}
							className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Enter card title'
						/>
					</div>
					<div>
						<label className='block text-sm text-gray-600 mb-2'>
							Card Description *
						</label>
						<textarea
							value={content.description}
							onChange={(e) =>
								handleContentChange('description', e.target.value)
							}
							className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]'
							placeholder='Enter card description'
						/>
					</div>
					{error && <p className='text-sm text-red-500'>{error}</p>}
				</div>
			</div>
		</div>
	);
};

const TableControls = ({ widget, updateWidget }) => {
	const [tableData, setTableData] = useState(
		widget?.content?.data ||
			Array(3)
				.fill()
				.map(() => Array(3).fill('Cell'))
	);
	const [rows, setRows] = useState(widget?.content?.rows || 3);
	const [columns, setColumns] = useState(widget?.content?.columns || 3);

	// Add useEffect to update state when widget changes
	useEffect(() => {
		if (widget?.content) {
			setTableData(widget.content.data);
			setRows(widget.content.rows);
			setColumns(widget.content.columns);
		}
	}, [widget]);

	// Null check after hooks
	if (!widget?.content) return null;

	const updateTable = (newData, newRows, newCols) => {
		setTableData(newData);
		setRows(newRows);
		setColumns(newCols);
		updateWidget({
			...widget,
			content: {
				rows: newRows,
				columns: newCols,
				data: newData,
			},
		});
	};

	const addRow = () => {
		const newData = [...tableData, Array(columns).fill('Cell')];
		updateTable(newData, rows + 1, columns);
	};

	const removeRow = () => {
		if (rows > 1) {
			const newData = tableData.slice(0, -1);
			updateTable(newData, rows - 1, columns);
		}
	};

	const addColumn = () => {
		const newData = tableData.map((row) => [...row, 'Cell']);
		updateTable(newData, rows, columns + 1);
	};

	const removeColumn = () => {
		if (columns > 1) {
			const newData = tableData.map((row) => row.slice(0, -1));
			updateTable(newData, rows, columns - 1);
		}
	};

	return (
		<div className='space-y-6 p-4'>
			<div>
				<h3 className='font-medium text-gray-800 mb-4'>Table Properties</h3>
				<div className='space-y-4'>
					{/* Row and Column Controls */}
					<div className='flex items-center justify-between'>
						<span className='text-sm text-gray-600'>Rows: {rows}</span>
						<div className='flex gap-2'>
							<button
								onClick={removeRow}
								disabled={rows <= 1}
								className='p-1 rounded hover:bg-gray-100 disabled:opacity-50'>
								<Minus size={16} />
							</button>
							<button
								onClick={addRow}
								className='p-1 rounded hover:bg-gray-100'>
								<Plus size={16} />
							</button>
						</div>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-gray-600'>Columns: {columns}</span>
						<div className='flex gap-2'>
							<button
								onClick={removeColumn}
								disabled={columns <= 1}
								className='p-1 rounded hover:bg-gray-100 disabled:opacity-50'>
								<Minus size={16} />
							</button>
							<button
								onClick={addColumn}
								className='p-1 rounded hover:bg-gray-100'>
								<Plus size={16} />
							</button>
						</div>
					</div>

					{/* Cell Editor */}
					<div className='mt-6'>
						<h4 className='text-sm font-medium text-gray-700 mb-3'>
							Edit Cells
						</h4>
						<div className='max-h-[400px] overflow-y-auto'>
							<table className='w-full border-collapse'>
								<tbody>
									{tableData.map((row, rowIndex) => (
										<tr key={rowIndex}>
											{row.map((cell, colIndex) => (
												<td
													key={colIndex}
													className='border border-gray-300 p-1'>
													<input
														type='text'
														value={cell}
														onChange={(e) => {
															const newData = tableData.map((r, rIndex) =>
																r.map((c, cIndex) =>
																	rIndex === rowIndex && cIndex === colIndex
																		? e.target.value
																		: c
																)
															);
															updateTable(newData, rows, columns);
														}}
														className='w-full p-1 focus:outline-none focus:ring-1 focus:ring-blue-500'
													/>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SideDrawer = ({
	isOpen,
	onClose,
	selectedWidget,
	updateWidget,
	onDelete,
}) => {
	const [error, setError] = useState('');
	const [tempWidget, setTempWidget] = useState(selectedWidget);

	useEffect(() => {
		setTempWidget(selectedWidget);
		setError('');
	}, [selectedWidget]);

	const handleSave = () => {
		if (!tempWidget) return;

		if (tempWidget.type === 'Card') {
			if (
				!tempWidget.content.title.trim() ||
				!tempWidget.content.description.trim()
			) {
				setError('Both title and description are required');
				return;
			}
		}

		updateWidget((widgets) =>
			widgets.map((w) => {
				if (w.type.startsWith('Column')) {
					// If updating a column widget itself
					if (w.i === tempWidget.i) {
						return tempWidget;
					}
					// Check for nested widgets in columns
					return {
						...w,
						content: {
							...w.content,
							columns: w.content.columns.map((column) =>
								column.map((cw) => (cw.i === tempWidget.i ? tempWidget : cw))
							),
						},
					};
				}
				return w.i === tempWidget.i ? tempWidget : w;
			})
		);
		onClose();
	};

	if (!isOpen || !selectedWidget) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop with smooth fade */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.5 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.3,
							ease: [0.4, 0, 0.2, 1], // Smooth easeInOut
						}}
						className='fixed inset-0 bg-black bg-opacity-50'
						onClick={onClose}
					/>
					{/* Drawer with smooth slide */}
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{
							type: 'tween', // Use tween for smooth motion
							duration: 0.3,
							ease: [0.4, 0, 0.2, 1], // Smooth easeInOut
						}}
						className='fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l border-gray-200 z-50'>
						<div className='flex items-center justify-between p-4 border-b border-gray-200'>
							<motion.h2
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.2 }}
								className='text-lg font-semibold text-gray-800'>
								Edit {selectedWidget.type}
							</motion.h2>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onClose}
								className='p-2 hover:bg-gray-100 rounded-lg'>
								<X size={20} />
							</motion.button>
						</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='overflow-y-auto h-[calc(100vh-64px)]'>
							{selectedWidget.type.startsWith('Column') && (
								<ColumnControls
									widget={selectedWidget}
									updateWidget={setTempWidget}
								/>
							)}
							{selectedWidget.type === 'Text' && (
								<TextControls
									widget={selectedWidget}
									updateWidget={setTempWidget}
									setError={setError}
								/>
							)}
							{selectedWidget.type === 'Image' && (
								<ImageControls
									widget={selectedWidget}
									updateWidget={setTempWidget}
								/>
							)}
							{selectedWidget.type === 'Button' && (
								<ButtonControls
									widget={selectedWidget}
									updateWidget={setTempWidget}
								/>
							)}
							{selectedWidget.type === 'Card' && (
								<CardControls
									widget={tempWidget}
									updateWidget={setTempWidget}
								/>
							)}
							{selectedWidget.type === 'Table' && (
								<TableControls
									widget={tempWidget}
									updateWidget={setTempWidget}
								/>
							)}

							<div className='p-4 border-t border-gray-200 bg-white sticky bottom-0'>
								{error && (
									<motion.p
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										className='text-sm text-red-500 mb-2'>
										{error}
									</motion.p>
								)}
								<div className='flex gap-2'>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleSave}
										className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
											error
												? 'bg-gray-300 cursor-not-allowed'
												: 'bg-blue-500 hover:bg-blue-600 text-white'
										}`}
										disabled={!!error}>
										<Save size={16} />
										Save Changes
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => onDelete(selectedWidget.i)}
										className='p-2 text-red-500 hover:bg-red-50 rounded-lg'>
										<Trash2 size={20} />
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

const EmptyCanvas = ({ onAddRow }) => {
	const [showOptions, setShowOptions] = useState(false);

	const columnOptions = [
		{ type: 'Column-1', label: '1 Column', layout: '100' },
		{ type: 'Column-2', label: '2 Columns', layout: '50-50' },
		{ type: 'Column-3', label: '3 Columns', layout: '33-33-33' },
	];

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<div className='text-center p-8'>
				<Layout className='w-12 h-12 text-gray-400 mx-auto mb-4' />
				<h3 className='text-lg font-medium text-gray-700 mb-2'>
					Start Building Your Layout
				</h3>
				<p className='text-gray-500 mb-4'>Select a column layout to begin</p>
				{!showOptions ? (
					<button
						onClick={() => setShowOptions(true)}
						className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
						<Layout className='w-4 h-4 mr-2' />
						Add Row
					</button>
				) : (
					<div className='flex gap-4 justify-center'>
						{columnOptions.map((option) => (
							<button
								key={option.type}
								onClick={() => onAddRow(option)}
								className='p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors'>
								<div className='flex gap-1 mb-2'>
									{option.type === 'Column-1' && (
										<div className='w-20 h-12 bg-gray-100 rounded' />
									)}
									{option.type === 'Column-2' && (
										<>
											<div className='w-10 h-12 bg-gray-100 rounded' />
											<div className='w-10 h-12 bg-gray-100 rounded' />
										</>
									)}
									{option.type === 'Column-3' && (
										<>
											<div className='w-6 h-12 bg-gray-100 rounded' />
											<div className='w-6 h-12 bg-gray-100 rounded' />
											<div className='w-6 h-12 bg-gray-100 rounded' />
										</>
									)}
								</div>
								<span className='text-sm font-medium text-gray-600'>
									{option.label}
								</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

const WidgetPanelBuilder = () => {
	const [layout, setLayout] = useState([]);
	const [widgets, setWidgets] = useState([]);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [savedLayouts, setSavedLayouts] = useState(() => {
		const saved = localStorage.getItem('savedLayouts');
		return saved ? JSON.parse(saved) : [];
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedLayout, setSelectedLayout] = useState(null);

	useEffect(() => {
		localStorage.setItem('savedLayouts', JSON.stringify(savedLayouts));
	}, [savedLayouts]);

	const handleDragStart = (e, widget) => {
		if (e) {
			e.dataTransfer.setData('widget', JSON.stringify(widget));
		} else {
			// Direct column widget addition without drag
			const newWidget = {
				...widget,
				i: new Date().getTime().toString(),
				x: 0,
				y: layout.length,
				w: 12, // Full width for columns
				h: 4,
			};
			setLayout([...layout, newWidget]);
			setWidgets([...widgets, newWidget]);
		}
	};

	const saveCurrentLayout = () => {
		const layoutName = prompt('Enter a name for this layout:');
		if (!layoutName) return;

		const newLayout = {
			id: Date.now(),
			name: layoutName,
			widgets: widgets,
			layout: layout,
		};

		const existingLayoutIndex = savedLayouts.findIndex(
			(layout) => layout.name === layoutName
		);

		let updatedLayouts;
		if (existingLayoutIndex !== -1) {
			// Update existing layout
			updatedLayouts = savedLayouts.map((layout, index) =>
				index === existingLayoutIndex ? newLayout : layout
			);
		} else {
			// Add new layout
			updatedLayouts = [...savedLayouts, newLayout];
		}

		setSavedLayouts(updatedLayouts);
	};

	const loadLayout = (savedLayout) => {
		setSelectedLayout(savedLayout);
		setWidgets(savedLayout.widgets);
		setLayout(savedLayout.layout);
		setIsDropdownOpen(false);
	};

	const handleClear = () => {
		if (window.confirm('Are you sure you want to clear the canvas?')) {
			setWidgets([]);
			setLayout([]);
			setSelectedLayout(null);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100'>
			<Header
				isDropdownOpen={isDropdownOpen}
				setIsDropdownOpen={setIsDropdownOpen}
				savedLayouts={savedLayouts}
				loadLayout={loadLayout}
				selectedLayout={selectedLayout}
			/>
			<div className='flex flex-1 relative'>
				<WidgetPanel onDragStart={handleDragStart} isCollapsed={isCollapsed} />
				<Canvas
					layout={layout}
					widgets={widgets}
					onLayoutChange={setLayout}
					onDrop={handleDragStart}
					setWidgets={setWidgets}
					setLayout={setLayout}
					updateWidget={setWidgets}
				/>
			</div>

			{/* Floating action buttons */}
			<div className='fixed bottom-6 right-6 flex gap-3'>
				<button
					onClick={handleClear}
					className='p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors'
					title='Clear canvas'>
					<Trash2 size={24} />
				</button>
				<button
					onClick={saveCurrentLayout}
					className='p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors'
					title='Save layout'>
					<Save size={24} />
				</button>
			</div>
		</div>
	);
};

export default WidgetPanelBuilder;
